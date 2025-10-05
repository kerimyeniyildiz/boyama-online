'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Category } from '@/types';

interface UploadResult {
  fileName: string;
  success: boolean;
  message: string;
}

export default function UploadPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data as Category[]);
      }
    } catch (fetchError) {
      console.error('Error fetching categories:', fetchError);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
    setUploadResults([]);
    setError('');
  };

  const handleUpload = async () => {
    if (!files || !selectedCategory) {
      setError('Please select category and files');
      return;
    }

    setIsLoading(true);
    setError('');
    const results: UploadResult[] = [];

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', selectedCategory);

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
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-primary-600 hover:text-primary-700">
                ??? Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Upload Images</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Coloring Page Images</h2>
            <p className="text-gray-600">
              Select a category and upload PNG or JPG files. Maximum file size: 5MB per file. WebP thumbnails are generated automatically.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Select Category *
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Choose a category...</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-2">
                Select Images *
              </label>
              <input
                type="file"
                id="files"
                multiple
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: PNG, JPG, JPEG. Each file must be 5MB or smaller.
              </p>
            </div>

            {files && files.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h3>
                <div className="space-y-2">
                  {Array.from(files).map((file, index) => (
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

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={handleUpload}
                disabled={!files || !selectedCategory || isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  `Upload ${files ? files.length : 0} File${files && files.length !== 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </div>
        </div>

        {uploadResults.length > 0 && (
          <div className="mt-8 card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Results</h3>
            <div className="space-y-3">
              {uploadResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium text-gray-700">{result.fileName}</span>
                  </div>
                  <span className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.message}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Successful uploads: {uploadResults.filter((result) => result.success).length} / {uploadResults.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
