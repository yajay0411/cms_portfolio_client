import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import { AppProvider } from '../../contexts/app.context';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { ThemeContextProvider } from '../../contexts/theme.context';

interface IProviderProps {
  children: ReactNode;
}

const Provider: React.FC<IProviderProps> = ({ children }) => {
  return (
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
  );
};

export default Provider;
