import { ErrorBoundary } from 'react-error-boundary';
import React, { ErrorInfo } from 'react';

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
}

export function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  const isDev = process.env.NODE_ENV === 'development';

  const logErrorToService = (error: Error, info: ErrorInfo) => {
    console.error('ErrorLogService:Logged Error:', error);
    console.error('ErrorLogService:Component Stack:', info.componentStack);
  };

  const renderFallBackDev = (props: { error: Error; resetErrorBoundary: () => void }) => {
    return (
      <div style={{ padding: 16, background: '#ffecec', color: '#b00000' }}>
        <h2>🔥 Error caught in Error Boundary (DEV)</h2>

        <pre
          style={{
            whiteSpace: 'pre-wrap',
            fontSize: 13,
            marginTop: 12,
            background: '#fff5f5',
            padding: 12,
            borderRadius: 4
          }}>
          {props.error.stack}
        </pre>

        <button
          style={{
            marginTop: 12,
            padding: '6px 12px',
            background: '#000',
            color: '#fff',
            borderRadius: 4
          }}
          onClick={props.resetErrorBoundary}>
          Reset UI
        </button>
      </div>
    );
  };

  const renderFallBackProd = () => {
    return (
      <div style={{ padding: 16, background: '#ffecec', color: '#b00000' }}>
        <h2>🔥 Something went wrong</h2>
        <p>We are sorry, but something went wrong. Please try again later or contact support if the problem persists.</p>
      </div>
    );
  };

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) =>
        isDev ? <>{renderFallBackDev({ error, resetErrorBoundary })}</> : <>{renderFallBackProd()}</>
      }
      onError={(error, info) => logErrorToService(error, info)}>
      {children}
    </ErrorBoundary>
  );
}
