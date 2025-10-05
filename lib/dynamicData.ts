// Client-side data fetching for dynamic content
import { Category } from '@/types';
import { getCategoriesWithImages } from '@/lib/fileSystem';

export async function fetchCategories(): Promise<Category[]> {
  try {
    const url = `/api/categories?ts=${Date.now()}`;
    const response = await fetch(url, { cache: 'no-store', headers: { 'Cache-Control': 'no-store' } });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const url = `/api/categories/${slug}?ts=${Date.now()}`;
    const response = await fetch(url, { cache: 'no-store', headers: { 'Cache-Control': 'no-store' } });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export function getFeaturedCategories(categories: Category[]): Category[] {
  return categories.filter(category => category.featured);
}

export function searchCategories(categories: Category[], query: string): Category[] {
  const lowercaseQuery = query.toLowerCase();
  return categories.filter(category =>
    category.title.toLowerCase().includes(lowercaseQuery) ||
    category.description.toLowerCase().includes(lowercaseQuery) ||
    category.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
  );
}
