'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="font-sans antialiased bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue min-h-screen">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="text-6xl mb-6">💔</div>
            <h1 className="font-heading font-bold text-3xl text-gray-800 mb-4">
              Something went wrong!
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We�re sorry, but something unexpected happened. Our coloring pages will be back soon!
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-6 text-left bg-red-50 p-4 rounded-lg">
                <summary className="cursor-pointer font-medium text-red-800 mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-sm text-red-700 overflow-auto">
                  {error.message}
                </pre>
                {error.digest && (
                  <p className="text-xs text-red-600 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg border-2 border-primary-200 hover:border-primary-300 transform hover:scale-105 transition-all duration-300"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
