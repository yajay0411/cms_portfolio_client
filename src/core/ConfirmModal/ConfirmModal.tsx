import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  content?: React.ReactNode;
  showActions?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmIcon?: React.ReactNode;
  cancelIcon?: React.ReactNode;
  actionsAlignment?: 'left' | 'center' | 'right' | 'outside';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = 'Confirmation',
  content = 'Are you sure you want to proceed?',
  showActions = true,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  confirmIcon = <CheckIcon />,
  cancelIcon = <CloseIcon />,
  actionsAlignment = 'right',
}) => {
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      // aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle
        id="confirm-dialog-title"
        sx={{ fontSize: '20px', fontWeight: 700 }}
        display={'flex'}
        justifyContent={title ? 'space-between' : 'flex-end'}
        alignItems={'center'}
      >
        {title && <span>{title}</span>}
        <CloseIcon onClick={onClose} sx={{ cursor: 'pointer' }} />
      </DialogTitle>
      <Divider />
      <DialogContent>{content}</DialogContent>
      {showActions && <Divider />}
      {showActions && (
        <DialogActions
          sx={{
            justifyContent:
              actionsAlignment === 'left'
                ? 'flex-start'
                : actionsAlignment === 'center'
                  ? 'center'
                  : 'flex-end',
            padding: '16px 24px',
          }}
        >
          <Button color="secondary" onClick={onClose} startIcon={cancelIcon}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              color="primary"
              variant="contained"
              onClick={onConfirm}
              startIcon={confirmIcon}
            >
              {confirmText}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ConfirmModal;
