'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Category, CategoryImage } from '@/types';

interface UploadResult {
  fileName: string;
  success: boolean;
  message: string;
}

export default function CategoryImagesPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [error, setError] = useState('');

  const fetchCategoryImages = useCallback(async () => {
    try {
      const response = await fetch(`/api/categories/${slug}?ts=${Date.now()}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-store' } });
      const data = await response.json();

      if (data.success && data.data) {
        setCategory(data.data as Category);
      } else {
        setError('Category not found');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to load category images');
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchCategoryImages();
    }
    }, [fetchCategoryImages, slug]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
    setUploadResults([]);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Please select files to upload');
      return;
    }

    setIsUploading(true);
    setError('');
    const results: UploadResult[] = [];

    for (let i = 0; i < selectedFiles.length; i += 1) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', slug);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();

        results.push({
          fileName: file.name,
          success: Boolean(data.success),
          message: data.success ? 'Uploaded successfully' : data.error || 'Upload failed',
        });
      } catch (uploadError) {
        console.error(uploadError);
        results.push({
          fileName: file.name,
          success: false,
          message: 'Network error',
        });
      }
    }

    setUploadResults(results);
    setIsUploading(false);

    if (results.some((result) => result.success)) {
      fetchCategoryImages();
    }
  };

  const handleDeleteImage = async (image: CategoryImage) => {
    if (!confirm(`Are you sure you want to delete ${image.originalFilename}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${slug}/images/${encodeURIComponent(image.id)}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setCategory(data.data as Category);
      } else {
        setError(data.error || 'Failed to delete image');
      }
    } catch (deleteError) {
      console.error(deleteError);
      setError('Failed to delete image');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category images...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="font-heading text-3xl font-bold text-gray-800">Category not found</h1>
          <Link href="/admin/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-primary-600 hover:text-primary-700">
                ??? Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{category.title} Images</h1>
            </div>
            <Link href={`/admin/categories/${category.slug}/edit`} className="btn-secondary text-sm">
              Edit Category
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload New Images</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-2">
                Select PNG or JPG files
              </label>
              <input
                id="fileUpload"
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                multiple
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum size per file: 5MB. Thumbnails are generated automatically as WebP.
              </p>
            </div>

            {selectedFiles && selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Selected Files</h3>
                <div className="space-y-2">
                  {Array.from(selectedFiles).map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <span className="text-xs text-gray-500">{file.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleUpload}
                disabled={!selectedFiles || selectedFiles.length === 0 || isUploading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  `Upload ${selectedFiles ? selectedFiles.length : 0} File${selectedFiles && selectedFiles.length !== 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </div>

          {uploadResults.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload Results</h3>
              <div className="space-y-2">
                {uploadResults.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{result.fileName}</span>
                    <span className="text-sm">{result.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Current Images ({category.images?.length || 0})
            </h2>
          </div>

          {category.images && category.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {category.images.map((image, index) => (
                <div key={image.id} className="group relative">
                  <div className="aspect-square bg-white rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                      src={image.thumbnailPath}
                      alt={`${category.title} ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                      unoptimized
                    />
                  </div>

                  <div className="mt-2 text-center">
                    <p className="text-xs text-gray-600 truncate" title={image.originalFilename}>
                      {image.originalFilename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(image.originalSize / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDeleteImage(image)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                      title="Delete image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={image.originalPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg"
                      title="View full size"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">?Y??</div>
              <h3 className="font-semibold text-xl text-gray-800 mb-2">No Images Yet</h3>
              <p className="text-gray-600 mb-6">Upload some coloring page images to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}








