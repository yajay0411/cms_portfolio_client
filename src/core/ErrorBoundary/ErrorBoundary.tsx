import React, { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './ErrorFallback';

interface Props {
  children: ReactNode;
}

const ErrorBoundary: React.FC<Props> = ({ children }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
