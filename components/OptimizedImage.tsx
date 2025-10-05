'use client';
/* eslint-disable @next/next/no-img-element */

import Image from 'next/image';
import { useState } from 'react';
import type { OptimizedImageProps } from '@/types';

const loadingSpinner = (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const fallbackPlaceholder = (
  <div className="flex items-center justify-center h-full bg-gradient-to-br from-pastel-pink to-pastel-purple text-white">
    <div className="text-center p-4">
      <div className="text-4xl mb-2">🎨</div>
      <p className="text-sm">Image coming soon!</p>
    </div>
  </div>
);

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoadComplete = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const resolvedSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw';
  const fallbackStyle = fill
    ? { width: '100%', height: '100%', objectFit: 'contain' as const, padding: '1.5rem' }
    : { width, height, objectFit: 'contain' as const };

  if (useFallback) {
    return (
      <div className={`relative ${className}`} style={fill ? { width: '100%', height: '100%' } : undefined}>
        {isLoading && loadingSpinner}
        {!hasError ? (
          <img
            src={src}
            alt={alt}
            style={fallbackStyle}
            className={`${!isLoading ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            onLoad={handleLoadComplete}
            onError={handleError}
          />
        ) : (
          fallbackPlaceholder
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={fill ? { width: '100%', height: '100%' } : undefined}>
      {isLoading && loadingSpinner}
      {hasError ? (
        fallbackPlaceholder
      ) : fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={resolvedSizes}
          className={`${isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'} transition-all duration-300 object-contain p-6`}
          onLoadingComplete={handleLoadComplete}
          onError={() => {
            setUseFallback(true);
            setIsLoading(true);
            handleError();
          }}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width ?? 800}
          height={height ?? 1000}
          priority={priority}
          sizes={resolvedSizes}
          className={`${isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'} transition-all duration-300 object-contain`}
          onLoadingComplete={handleLoadComplete}
          onError={() => {
            setUseFallback(true);
            setIsLoading(true);
            handleError();
          }}
        />
      )}
    </div>
  );
}
