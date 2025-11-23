import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { ThemeContextProvider } from '@contexts/theme/theme-provider';
import { AuthContextProvider } from '@contexts/auth/auth-provider';
import { ErrorBoundaryWrapper } from '@core/ErrorBoundary/ErrorBoundary';
import { AppConfig } from '@config/configuration';

interface IProviderProps {
  children: ReactNode;
}

const Provider: React.FC<IProviderProps> = ({ children }) => {
  return (
    <ErrorBoundaryWrapper>
      <GoogleOAuthProvider clientId={AppConfig.GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <ThemeContextProvider>
              <AuthContextProvider>{children}</AuthContextProvider>
            </ThemeContextProvider>
          </SnackbarProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ErrorBoundaryWrapper>
  );
};

export default Provider;
