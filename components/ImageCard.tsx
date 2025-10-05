'use client';

import OptimizedImage from './OptimizedImage';
import { useState } from 'react';
import type { CategoryImage } from '@/types';

interface ImageCardProps {
  image: CategoryImage;
  title?: string;
  onDownload: (image: CategoryImage) => void;
}

export default function ImageCard({ image, title, onDownload }: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleDownload = () => {
    onDownload(image);
  };

  return (
    <div className="card card-hover group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-white flex items-center justify-center">
        {!hasError ? (
          <OptimizedImage
            src={image.thumbnailPath}
            alt={title || image.originalFilename}
            fill
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-pastel-pink to-pastel-purple">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">�Y?�</div>
              <p className="text-sm text-white">Image coming soon!</p>
            </div>
          </div>
        )}

        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}

        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
      </div>

      <div className="p-4 space-y-3">
        {title && (
          <h3 className="font-medium text-gray-800 text-sm line-clamp-2" title={title}>
            {title}
          </h3>
        )}

        <button
          onClick={handleDownload}
          className="w-full btn-primary text-sm py-2 px-4 flex items-center justify-center space-x-2"
          aria-label={`Download ${title || image.originalFilename}`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
}
