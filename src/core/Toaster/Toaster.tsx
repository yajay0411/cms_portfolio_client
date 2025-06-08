import { ReactNode } from 'react';

import {
  useSnackbar,
  OptionsObject,
  SnackbarKey,
  VariantType,
} from 'notistack';

import CancelIcon from '@mui/icons-material/Cancel';

interface SnackbarConfig extends OptionsObject {
  variant?: VariantType;
  message?: string;
  action?: ReactNode;
  CloseAction?: boolean;
}

const useToaster = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showToaster = (
    message: string,
    config?: SnackbarConfig
  ): SnackbarKey => {
    return enqueueSnackbar(message, {
      variant: config?.variant || 'default',
      anchorOrigin: config?.anchorOrigin || {
        vertical: 'top',
        horizontal: 'right',
      },
      autoHideDuration: config?.autoHideDuration ?? 3000,
      preventDuplicate: config?.preventDuplicate ?? true,
      persist: config?.persist ?? false,
      action: (key) =>
        config?.CloseAction ? (
          <button
            onClick={() => closeSnackbar(key)}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              marginLeft: '10px',
              color: '#fff',
            }}
          >
            <CancelIcon />
          </button>
        ) : (
          config?.action
        ),
      ...config,
    });
  };

  const hideToaster = (key: SnackbarKey) => {
    closeSnackbar(key);
  };

  return { showToaster, hideToaster };
};

export default useToaster;
