import React from 'react';

const ErrorBoundary = ({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>;
};

export default ErrorBoundary;