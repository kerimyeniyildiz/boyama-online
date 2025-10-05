'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface CategoryForm {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  keywords: string;
  featured: boolean;
}

export default function EditCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [formData, setFormData] = useState<CategoryForm>({
    slug: '',
    title: '',
    description: '',
    metaDescription: '',
    keywords: '',
    featured: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${slug}`);
        const data = await response.json();

        if (data.success && data.data) {
          const category = data.data;
          setFormData({
            slug: category.slug,
            title: category.title,
            description: category.description || '',
            metaDescription: category.metaDescription || '',
            keywords: category.keywords ? category.keywords.join(', ') : '',
            featured: category.featured || false
          });
        } else {
          setError('Category not found');
        }
      } catch (error) {
        setError('Failed to load category');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const keywordsArray = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const response = await fetch(`/api/categories/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          metaDescription: formData.metaDescription,
          keywords: keywordsArray,
          featured: formData.featured
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Category updated successfully!');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1500);
      } else {
        setError(data.error || 'Failed to update category');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${slug}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Failed to delete category');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-primary-600 hover:text-primary-700">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
                placeholder="e.g., Princess Coloring Pages"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="A brief description of this category..."
              />
            </div>

            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description (SEO)
              </label>
              <textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="SEO meta description for search engines..."
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 150-160 characters for better SEO
              </p>
            </div>

            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (SEO)
              </label>
              <input
                type="text"
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="princess, coloring pages, kids, printable"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate keywords with commas
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Mark as featured category
              </label>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete Category
              </button>

              <div className="flex space-x-4">
                <Link
                  href="/admin/dashboard"
                  className="btn-secondary"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}