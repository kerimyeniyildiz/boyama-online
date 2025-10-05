'use client';

import React from 'react';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-6xl mb-6">😞</div>
        <h1 className="font-heading font-bold text-3xl text-gray-800 mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Don�t worry, our coloring pages are still waiting for you!
        </p>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 text-left bg-red-50 p-4 rounded-lg">
            <summary className="cursor-pointer font-medium text-red-800 mb-2">
              Error Details (Development)
            </summary>
            <pre className="text-sm text-red-700 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={resetError} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const ErrorComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <ErrorComponent error={this.state.error} resetError={this.resetError} />
      );
    }

    return this.props.children;
  }
}
