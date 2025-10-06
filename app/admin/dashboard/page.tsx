'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Category } from '@/types';

export default function AdminDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[DASHBOARD] Checking authentication...');
        const response = await fetch('/api/auth/check', {
          credentials: 'include',
        });
        const data = await response.json();
        console.log('[DASHBOARD] Auth check result:', data);

        if (!data.authenticated) {
          console.log('[DASHBOARD] Not authenticated, redirecting to login...');
          router.replace('/admin');
          return;
        }
        console.log('[DASHBOARD] Authenticated, loading dashboard...');
      } catch (error) {
        console.error('[DASHBOARD] Auth check error:', error);
        router.replace('/admin');
        return;
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?ts=' + Date.now(), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-store' },
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      } else {
        setError(data.error || 'Failed to fetch categories');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const deleteCategory = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${slug}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setCategories(prev => prev.filter(cat => cat.slug !== slug));
      } else {
        alert('Failed to delete category: ' + data.error);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  useEffect(() => {
    if (!isCheckingAuth) {
      fetchCategories();
    }
  }, [isCheckingAuth]);

  if (isCheckingAuth || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{isCheckingAuth ? 'Checking authentication...' : 'Loading dashboard...'}</p>
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
            <div className="flex items-center">
              <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm py-2 px-4"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                ğŸ“
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-secondary-100 text-secondary-600">
                ğŸ¨
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Images</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.reduce((sum, cat) => sum + cat.images.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                â­
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Featured Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.filter(cat => cat.featured).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Categories Management</h2>
          <div className="space-x-3">
            <Link href="/admin/categories/new" className="btn-primary">
              Add New Category
            </Link>
            <Link href="/admin/upload" className="btn-secondary">
              Upload Images
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Categories Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Images
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.slug} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.title}</div>
                        <div className="text-sm text-gray-500">{category.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category.images.length} images
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.featured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.images.length > 0
                        ? new Date(category.images[category.images.length - 1].uploadDate).toLocaleDateString()
                        : 'No images'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/categories/${category.slug}/edit`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/categories/${category.slug}/images`}
                        className="text-secondary-600 hover:text-secondary-900"
                      >
                        Images
                      </Link>
                      <button
                        onClick={() => deleteCategory(category.slug)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {categories.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No categories found. Create your first category to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

