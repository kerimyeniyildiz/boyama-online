'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import { CategoryCardSkeleton } from '@/components/SkeletonLoader';
import { fetchCategories, getFeaturedCategories, searchCategories } from '@/lib/dynamicData';
import type { Category } from '@/types';

export default function HomePageClient() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [categories, setCategories] = useState<Category[]>([]);
  const [displayedCategories, setDisplayedCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
        setDisplayedCategories(fetchedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery && categories.length > 0) {
      const filtered = searchCategories(categories, searchQuery);
      setDisplayedCategories(filtered);
    } else {
      setDisplayedCategories(categories);
    }
  }, [searchQuery, categories]);

  const featuredCategories = getFeaturedCategories(categories);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section Skeleton */}
        <section className="relative py-20 px-4 text-center">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-6">
              <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse mx-auto max-w-2xl"></div>
              <div className="h-8 bg-gray-200 rounded-xl animate-pulse mx-auto max-w-xl"></div>
              <div className="h-6 bg-gray-200 rounded-lg animate-pulse mx-auto max-w-md"></div>
            </div>
          </div>
        </section>

        {/* Search Skeleton */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-2xl">
            <div className="h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </section>

        {/* Categories Skeleton */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="h-10 bg-gray-200 rounded-xl animate-pulse mx-auto max-w-md mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-lg animate-pulse mx-auto max-w-lg"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6 animate-fade-in">
            <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl gradient-text text-shadow">
              Fun Coloring Pages
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Free printable coloring pages for kids. Download and print beautiful designs
              featuring your favorite characters, animals, and more!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <div className="inline-flex items-center gap-2 bg-white/80 px-5 py-2 rounded-full text-primary-700 font-medium shadow-sm">
                <span role="img" aria-label="sparkles">✨</span>
                <span>100% Free to Download</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/80 px-5 py-2 rounded-full text-primary-700 font-medium shadow-sm">
                <span role="img" aria-label="printer">🖨️</span>
                <span>High Quality Printable</span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 text-4xl opacity-20 animate-bounce-gentle">🎨</div>
          <div className="absolute top-20 right-20 text-3xl opacity-20 animate-bounce-gentle" style={{animationDelay: '0.5s'}}>✏️</div>
          <div className="absolute bottom-10 left-20 text-3xl opacity-20 animate-bounce-gentle" style={{animationDelay: '1s'}}>🖍️</div>
          <div className="absolute bottom-20 right-10 text-4xl opacity-20 animate-bounce-gentle" style={{animationDelay: '1.5s'}}>🌈</div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <SearchBar placeholder="Search for Elsa, Cars, Animals..." />
        </div>
      </section>

      {/* Search Results or Featured Categories */}
      {searchQuery ? (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-800 mb-4">
                Search Results for &ldquo;{searchQuery}&rdquo;
              </h2>
              <p className="text-gray-600">
                Found {displayedCategories.length} categor{displayedCategories.length === 1 ? 'y' : 'ies'}
              </p>
            </div>

            {displayedCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayedCategories.map((category) => (
                  <CategoryCard key={category.slug} category={category} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-heading font-semibold text-2xl text-gray-800 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try searching for different keywords like &ldquo;princess&rdquo;, &ldquo;cars&rdquo;, or &ldquo;animals&rdquo;
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-primary"
                >
                  Browse All Categories
                </button>
              </div>
            )}
          </div>
        </section>
      ) : (
        <>
          {/* Featured Categories */}
          <section className="py-12 px-4" id="featured-categories">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-800 mb-4">
                  Featured Categories
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover our most popular coloring page collections, perfect for kids of all ages
                </p>
              </div>

              {featuredCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {featuredCategories.map((category) => (
                    <CategoryCard key={category.slug} category={category} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No featured categories available.</p>
                </div>
              )}
            </div>
          </section>

          {/* All Categories */}
          <section className="py-12 px-4 bg-white/30 backdrop-blur-sm">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-800 mb-4">
                  All Categories
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Browse our complete collection of coloring pages
                </p>
              </div>

              {categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {categories.map((category) => (
                    <CategoryCard key={category.slug} category={category} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No categories available yet. Please check back later!</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="card p-12 space-y-6">
            <h2 className="font-heading font-bold text-3xl md:text-4xl gradient-text">
              Start Coloring Today!
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Download your favorite coloring pages and let your creativity shine.
              All our designs are completely free and ready to print.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.querySelector('#featured-categories')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                Browse Categories
              </button>
              <button
                onClick={() => (document.querySelector('input[type="text"]') as HTMLInputElement | null)?.focus()}
                className="btn-secondary"
              >
                Search Pages
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
