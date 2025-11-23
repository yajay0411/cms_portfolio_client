import React from 'react';
import { TEST_IDS } from '@constants/testIds';
import { useThemeState } from '@contexts/theme/hooks/use-theme-state';
import { Box } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';

interface GoogleOAuthLoginFromProps {
  isLoading: boolean;
  handleGoogleLogin: (credentialResponse: any) => void;
}

const GoogleOAuthLoginFrom: React.FC<GoogleOAuthLoginFromProps> = ({ handleGoogleLogin }) => {
  const { themeMode } = useThemeState();
  return (
    <Box
      data-testid={TEST_IDS.login.googleSigninButton}
      sx={{
        width: '100%',
        boxShadow: '0 1px 4px #0004'
      }}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          handleGoogleLogin({ ...credentialResponse, provider: 'GOOGLE' });
        }}
        onError={() => {
          handleGoogleLogin({ provider: 'GOOGLE', error: 'Error' });
        }}
        width="100%"
        logo_alignment="left"
        context="signin"
        text="continue_with"
        shape="rectangular"
        locale="red"
        theme={themeMode === 'dark' ? 'filled_black' : 'filled_blue'}
      />
    </Box>
  );
};

export default GoogleOAuthLoginFrom;
