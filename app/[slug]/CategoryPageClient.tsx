'use client';

import Link from 'next/link';
import ImageCard from '@/components/ImageCard';
import Breadcrumb from '@/components/Breadcrumb';
import type { Category, CategoryImage } from '@/types';
import { generatePDFFromImage, getImageFilenameFromUrl } from '@/lib/pdfGenerator';

interface CategoryPageClientProps {
  category: Category;
}

function sanitizeFilenameSegment(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'coloring-page';
}

export default function CategoryPageClient({ category }: CategoryPageClientProps) {
  const handleDownload = async (image: CategoryImage, imageIndex: number) => {
    const baseName = sanitizeFilenameSegment(category.title || category.slug);
    const sequentialFilename = `${baseName}-${String(imageIndex + 1).padStart(3, '0')}.pdf`;

    try {
      await generatePDFFromImage(image.originalPath, sequentialFilename);
    } catch (error) {
      console.error('Failed to generate PDF:', error);

      const link = document.createElement('a');
      link.href = image.originalPath;
      const fallbackName = `${getImageFilenameFromUrl(image.originalPath).replace(/\.pdf$/, '')}.png`;
      link.download = fallbackName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: category.title, href: `/${category.slug}` },
  ];

  return (
    <div className="min-h-screen">
      <Breadcrumb items={breadcrumbItems} />

      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl gradient-text text-shadow">
            {category.title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            {category.description}
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-gray-700 font-medium">{category.images.length} Free Images</span>
            </div>
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-gray-700 font-medium">High Quality</span>
            </div>
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span className="text-gray-700 font-medium">Ready to Print</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {category.images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {category.images.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                title={`${category.title} #${index + 1}`}
                onDownload={(img) => handleDownload(img, index)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">?Y??</div>
            <h3 className="font-heading font-semibold text-2xl text-gray-800 mb-4">
              Images Coming Soon!
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We�re working hard to add beautiful {category.title.toLowerCase()} for you.
              Check back soon for new additions!
            </p>
            <Link href="/" className="btn-primary">
              Browse Other Categories
            </Link>
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="card p-8 max-w-4xl mx-auto">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-800 mb-6 text-center">
            How to Use These Coloring Pages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-2xl">1</span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-gray-800">
                Choose & Download
              </h3>
              <p className="text-gray-600 text-sm">
                Click the download button on any image you like. It�s completely free!
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-2xl">2</span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-gray-800">
                Print at Home
              </h3>
              <p className="text-gray-600 text-sm">
                Print the coloring page on regular paper using your home printer.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-2xl">3</span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-gray-800">
                Start Coloring!
              </h3>
              <p className="text-gray-600 text-sm">
                Use crayons, colored pencils, or markers to bring the images to life.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-800 mb-4">
            You Might Also Like
          </h2>
          <p className="text-gray-600">Explore more coloring page categories</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/elsa-coloring-pages" className="btn-secondary text-sm">
            Elsa Pages
          </Link>
          <Link href="/cars-coloring-pages" className="btn-secondary text-sm">
            Cars Pages
          </Link>
          <Link href="/animals-coloring-pages" className="btn-secondary text-sm">
            Animals Pages
          </Link>
          <Link href="/princess-coloring-pages" className="btn-secondary text-sm">
            Princess Pages
          </Link>
          <Link href="/" className="btn-primary text-sm">
            View All Categories
          </Link>
        </div>
      </section>
    </div>
  );
}

