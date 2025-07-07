import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { AppProvider } from '@contexts/app.context';
import ErrorBoundary from '@core/ErrorBoundary/ErrorBoundary';
import { ThemeContextProvider } from '@contexts/theme.context';

interface IProviderProps {
  children: ReactNode;
}

const Provider: React.FC<IProviderProps> = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <ErrorBoundary>
        <BrowserRouter>
          <SnackbarProvider
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <ThemeContextProvider>
              <AppProvider>{children}</AppProvider>
            </ThemeContextProvider>
          </SnackbarProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  );
};

export default Provider;
