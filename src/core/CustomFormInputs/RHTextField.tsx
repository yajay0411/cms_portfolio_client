import React, {
  ReactNode,
  useState,
  useCallback,
  memo,
  useEffect,
} from 'react';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import type { TextFieldProps } from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Controller, useFormContext } from 'react-hook-form';

type InputTypes =
  | 'text'
  | 'number'
  | 'password'
  | 'email'
  | 'date'
  | 'datetime-local'
  | 'month'
  | 'time'
  | 'week'
  | 'tel'
  | 'url'
  | 'search'
  | 'color'
  | 'file'
  | 'checkbox';

interface FileInputOptions {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
}

interface RHTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  name: string;
  testId?: string;
  type?: InputTypes;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  onIconClick?: () => void;
  defaultValue?: string | number | boolean | null;
  validationRules?: Record<string, any>;
  variant: 'outlined' | 'filled' | 'standard'; // Match MUI TextFieldVariants
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputOptions?: FileInputOptions;
  previewsObj?: any[];
  enableDragDrop?: boolean;
  label?: string; // For checkbox label
}

interface FilePreview {
  url: string;
  name: string;
  type: string;
  isImage: boolean;
  size: string;
}

const RHTextField: React.FC<RHTextFieldProps> = memo(
  ({
    name,
    type = 'text',
    icon,
    iconPosition = 'end',
    onIconClick,
    defaultValue = '',
    placeholder,
    validationRules,
    variant,
    onBlur,
    onFocus,
    onChange,
    fileInputOptions,
    previewsObj = [],
    enableDragDrop = false,
    label,
    testId,
    ...props
  }) => {
    const { control } = useFormContext();
    const [previews, setPreviews] = useState<FilePreview[]>(previewsObj);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isDragActive, setIsDragActive] = useState<boolean>(false);
    const theme = useTheme();

    const isImageFile = (file: File) => file.type.startsWith('image/');

    const formatFileSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} bytes`;
      if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / 1048576).toFixed(1)} MB`;
    };

    const validateFile = useCallback(
      (file: File): boolean => {
        if (!fileInputOptions) return true;

        if (fileInputOptions.accept) {
          const allowedTypes = fileInputOptions.accept
            .split(',')
            .map((type) => type.trim());
          const isValidType = allowedTypes.some((type) => {
            if (type.startsWith('.')) {
              return file.name.toLowerCase().endsWith(type.toLowerCase());
            }
            if (type.includes('/*')) {
              const group = type.split('/')[0];
              return file.type.startsWith(group);
            }
            return file.type === type;
          });
          if (!isValidType) {
            setFileError(
              `Invalid file type. Allowed: ${fileInputOptions.accept}`
            );
            return false;
          }
        }

        if (fileInputOptions.maxSize && file.size > fileInputOptions.maxSize) {
          setFileError(
            `File size exceeds ${formatFileSize(fileInputOptions.maxSize)}`
          );
          return false;
        }

        setFileError(null);
        return true;
      },
      [fileInputOptions]
    );

    const processFiles = useCallback(
      (files: File[], fieldOnChange: (...event: any[]) => void) => {
        const validFiles = files.filter((file) => validateFile(file));
        if (validFiles.length === 0) {
          setPreviews([]);
          fieldOnChange(null);
          return;
        }

        const newPreviews = validFiles.map((file) => ({
          url: URL.createObjectURL(file),
          name: file.name,
          type: file.type,
          isImage: isImageFile(file),
          size: formatFileSize(file.size),
        }));

        setPreviews((prev) => {
          prev.forEach((p) => URL.revokeObjectURL(p.url));
          return newPreviews;
        });

        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));

        fieldOnChange(dataTransfer.files);
      },
      [validateFile]
    );

    const handleFileChange = useCallback(
      (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldOnChange: (...event: any[]) => void
      ) => {
        const files = e.target.files;
        if (!files) {
          setPreviews([]);
          fieldOnChange(null);
          return;
        }
        processFiles(Array.from(files), fieldOnChange);
      },
      [processFiles]
    );

    const handleDragDrop = useCallback(
      (
        e: React.DragEvent<HTMLDivElement>,
        fieldOnChange: (...event: any[]) => void
      ) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer.files) {
          const droppedFiles = Array.from(e.dataTransfer.files);
          const filesToProcess = fileInputOptions?.multiple
            ? droppedFiles
            : [droppedFiles[0]];
          processFiles(filesToProcess, fieldOnChange);
        }
      },
      [fileInputOptions, processFiles]
    );

    useEffect(() => {
      return () => {
        previews.forEach((preview) => URL.revokeObjectURL(preview.url));
      };
    }, [previews]);

    return (
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue ?? ''}
        rules={validationRules}
        render={({
          field: { onChange: fieldOnChange, onBlur: fieldOnBlur, value, ref },
          fieldState: { error },
        }) => (
          <Box
            onDragOver={(e) => enableDragDrop && e.preventDefault()}
            onDragEnter={() => enableDragDrop && setIsDragActive(true)}
            onDragLeave={() => enableDragDrop && setIsDragActive(false)}
            onDrop={(e) => enableDragDrop && handleDragDrop(e, fieldOnChange)}
            sx={{ width: '100%' }}
          >
            {type === 'checkbox' ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!value}
                    onChange={(e) => {
                      fieldOnChange(e.target.checked);
                      onChange?.(e);
                    }}
                    inputRef={ref}
                    data-testid={testId}
                  />
                }
                label={label || ''}
              />
            ) : (
              <TextField
                fullWidth
                {...props}
                label={label || ''}
                inputRef={ref}
                value={type === 'file' ? undefined : value}
                type={type}
                placeholder={placeholder}
                variant={variant}
                error={!!error || !!fileError}
                helperText={error?.message || fileError}
                InputProps={{
                  endAdornment: icon && iconPosition === 'end' && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={onIconClick}
                        data-testid={`${testId}-icon`}
                      >
                        {icon}
                      </IconButton>
                    </InputAdornment>
                  ),
                  startAdornment: icon && iconPosition === 'start' && (
                    <InputAdornment position="start">
                      <IconButton
                        onClick={onIconClick}
                        data-testid={`${testId}-icon`}
                      >
                        {icon}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onBlur={(e: any) => {
                  fieldOnBlur();
                  onBlur?.(e);
                }}
                onFocus={onFocus}
                onChange={(e: any) => {
                  if (type === 'file') {
                    handleFileChange(
                      e as React.ChangeEvent<HTMLInputElement>,
                      fieldOnChange
                    );
                    onChange?.(e);
                  } else {
                    fieldOnChange(e.target.value);
                    onChange?.(e);
                  }
                }}
                inputProps={{
                  multiple: fileInputOptions?.multiple,
                  accept: fileInputOptions?.accept,
                  'data-testid': testId,
                }}
              />
            )}
            {enableDragDrop && isDragActive && (
              <Paper
                elevation={3}
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: theme.palette.grey[200],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.7,
                  zIndex: 10,
                }}
                data-testid={`${testId}-dropzone`}
              >
                <Typography variant="h6">Drop files here...</Typography>
              </Paper>
            )}
            {type === 'file' && previews.length > 0 && (
              <Stack spacing={1} mt={2} data-testid={`${testId}-previews`}>
                {previews.map((preview, index) => (
                  <Paper
                    key={index}
                    sx={{ p: 1 }}
                    data-testid={`${testId}-preview-${index}`}
                  >
                    {preview.name && (
                      <Typography variant="body2">
                        {preview.name} ({preview.size})
                      </Typography>
                    )}
                    {preview.isImage && (
                      <Box
                        component="img"
                        src={preview.url}
                        alt={preview.name}
                        sx={{ width: 100, height: 100, mt: 1 }}
                        data-testid={`${testId}-preview-image-${index}`}
                      />
                    )}
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        )}
      />
    );
  }
);

export default RHTextField;
