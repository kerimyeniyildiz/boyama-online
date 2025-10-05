import HomePageClient from './HomePageClient';
import { getCategoriesWithImages, syncCategoriesWithFileSystem } from '@/lib/fileSystem';
import { siteConfig } from '@/lib/data';

// Enable Incremental Static Regeneration (ISR)
export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  try {
    syncCategoriesWithFileSystem();
  } catch (error) {
    console.error('Error syncing categories:', error);
  }

  const categories = await getCategoriesWithImages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Coloring Page Categories',
      description: 'Free printable coloring pages for kids organized by category',
      numberOfItems: categories.length,
      itemListElement: categories.map((category, index) => ({
        '@type': 'CreativeWork',
        position: index + 1,
        name: category.title,
        description: category.metaDescription || category.description,
        url: `${siteConfig.url}/${category.slug}`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomePageClient />
    </>
  );
}
