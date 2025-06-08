import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useForm, FormProvider } from 'react-hook-form';

import AttachFile from '@mui/icons-material/AttachFile';
import Description from '@mui/icons-material/Description';
import Article from '@mui/icons-material/Article';
import RHTextField from '@core/CustomFormInputs/RHTextField';

interface PortfolioFormData {
  entity: string;
  name: string;
  summary: string;
  landing_page_photo: FileList | null;
}

interface PortfolioFormProps {
  methods: ReturnType<typeof useForm<PortfolioFormData>>;
  onSubmit: (data: any) => void;
  handleCancel: () => void;
  photoPreview?: any[];
  label?: string;
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({
  methods,
  onSubmit,
  handleCancel,
  photoPreview,
  label = 'Create',
}) => {
  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {/* Entity */}
          <RHTextField
            variant="outlined"
            name="entity"
            label="Entity"
            type="text"
            defaultValue={''}
            icon={<Article />}
            iconPosition="start"
            validationRules={{
              required: 'Entity name is required',
            }}
            fullWidth
          />

          {/* Portfolio Name */}
          <RHTextField
            variant="outlined"
            name="name"
            label="Portfolio Name"
            type="text"
            defaultValue={''}
            icon={<Article />}
            iconPosition="start"
            validationRules={{
              required: 'Portfolio name is required',
            }}
            fullWidth
          />

          {/* Summary */}
          <RHTextField
            variant="outlined"
            name="summary"
            label="Summary"
            type="text"
            multiline
            rows={4}
            defaultValue={''}
            icon={<Description />}
            iconPosition="start"
            validationRules={{
              required: 'Summary is required',
            }}
            fullWidth
          />

          {/* Document Upload */}
          <RHTextField
            variant="outlined"
            name="landing_page_photo"
            label="Landing Page Picture (Optional)"
            type="file"
            icon={<AttachFile />}
            previewsObj={photoPreview ?? []}
            iconPosition="start"
            fileInputOptions={{
              accept: '.png, .jpg, .jpeg',
              maxSize: 5 * 1024 * 1024,
              multiple: true,
            }}
            fullWidth
          />

          {/* Buttons */}
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              size="large"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
            >
              {label} Portfolio
            </Button>
          </Box>
        </Stack>
      </Box>
    </FormProvider>
  );
};

export default PortfolioForm;