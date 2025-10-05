'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search coloring pages...",
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-4 pl-12 text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-white/30 rounded-2xl shadow-lg focus:outline-none focus:border-primary-300 focus:shadow-xl transition-all duration-300 placeholder-gray-400"
          aria-label="Search coloring page categories"
          role="searchbox"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-4" aria-hidden="true">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}