import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getCategoriesWithImages, syncCategoriesWithFileSystem } from '@/lib/fileSystem';
import { siteConfig } from '@/lib/data';
import CategoryPageClient from './CategoryPageClient';

// Enable Incremental Static Regeneration
export const revalidate = 3600; // Revalidate every hour

interface Props {
  params: { slug: string };
}

// Pre-generate paths for all categories at build time
export async function generateStaticParams() {
  try {
    syncCategoriesWithFileSystem();
    const categories = await getCategoriesWithImages();

    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

const siteUrl = siteConfig.url;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await syncCategoriesWithFileSystem();
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested coloring page category could not be found.',
    };
  }

  const title = category.title;
  const description = category.metaDescription || category.description;
  const keywords = category.keywords;
  const url = `${siteUrl}/${category.slug}`;
  const primaryImage = category.images[0]?.originalPath || '/og-image.png';

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Fun Coloring Pages Team' }],
    creator: 'Fun Coloring Pages',
    publisher: 'Fun Coloring Pages',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [primaryImage],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  await syncCategoriesWithFileSystem();
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: category.title,
    description: category.description,
    url: `${siteUrl}/${category.slug}`,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteUrl,
    },
    keywords: category.keywords.join(', '),
    datePublished: category.images[0]?.uploadDate || new Date().toISOString(),
    dateModified:
      category.images[category.images.length - 1]?.uploadDate || new Date().toISOString(),
    isAccessibleForFree: true,
    educationalUse: 'coloring, creativity, art education',
    audience: {
      '@type': 'Audience',
      audienceType: 'children',
    },
    hasPart: category.images.map((image, index) => {
      const fullUrl = `${siteUrl}${image.originalPath}`;
      const extension = image.originalPath.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

      return {
        '@type': 'ImageObject',
        name: `${category.title} #${index + 1}`,
        description: `Free printable ${category.title.toLowerCase()} coloring page`,
        url: fullUrl,
        contentUrl: fullUrl,
        encodingFormat: extension,
        uploadDate: image.uploadDate,
        isAccessibleForFree: true,
      };
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CategoryPageClient category={category} />
    </>
  );
}

