import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const thumbnailPath = category.images[0]?.thumbnailPath;

  return (
    <Link href={`/${category.slug}`} className="block group">
      <div className="card card-hover">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-gradient-to-br from-pastel-pink to-pastel-purple">
          {thumbnailPath ? (
            <div className="relative w-full h-full flex items-center justify-center bg-white">
              <Image
                src={thumbnailPath}
                alt={category.title}
                fill
                className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={false}
                unoptimized
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🎨</div>
                <p className="font-medium">Images coming soon</p>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-4 right-4 rounded-full px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 shadow-sm">
            {category.images.length} image{category.images.length === 1 ? '' : 's'}
          </div>
        </div>

        <div className="p-6 space-y-3">
          <h3 className="font-heading font-semibold text-xl text-gray-800 group-hover:text-primary-600 transition-colors duration-200">
            {category.title}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {category.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-primary-600 font-medium text-sm group-hover:text-primary-700 transition-colors duration-200">
              View Collection &rarr;
            </span>
            {category.featured && (
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}


