import type { Category, SiteConfig } from '@/types';

const fallbackUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000';

export const siteConfig: SiteConfig = {
  name: 'Fun Coloring Pages',
  description:
    'Free printable coloring pages for kids. Download and print beautiful designs featuring Disney characters, animals, cars, and more!',
  url: fallbackUrl,
  ogImage: '/og-image.png',
  keywords: ['coloring pages', 'kids', 'printable', 'free', 'disney', 'animals', 'cars', 'princess', 'educational'],
};

export const defaultCategories: Category[] = [
  {
    slug: 'elsa-coloring-pages',
    title: 'Elsa Coloring Pages',
    description:
      "Beautiful Elsa coloring pages featuring the beloved Frozen princess. Perfect for kids who love Disney's magical ice queen.",
    metaDescription:
      'Free printable Elsa coloring pages for kids. Download and print beautiful Frozen princess designs featuring Queen Elsa.',
    keywords: ['elsa', 'frozen', 'disney', 'princess', 'coloring pages', 'kids', 'printable'],
    images: [],
    featured: true,
  },
  {
    slug: 'cars-coloring-pages',
    title: 'Cars Coloring Pages',
    description:
      'Exciting car coloring pages with racing cars, sports cars, and everyday vehicles. Perfect for young car enthusiasts.',
    metaDescription: 'Free printable car coloring pages for kids. Download racing cars, sports cars, and vehicle designs to color.',
    keywords: ['cars', 'vehicles', 'racing', 'sports cars', 'coloring pages', 'kids', 'printable'],
    images: [],
    featured: true,
  },
  {
    slug: 'animals-coloring-pages',
    title: 'Animals Coloring Pages',
    description:
      'Adorable animal coloring pages featuring cute pets, wild animals, and farm animals. Great for learning about nature.',
    metaDescription: 'Free printable animal coloring pages for kids. Download cute pets, wild animals, and farm animal designs.',
    keywords: ['animals', 'pets', 'wild animals', 'farm animals', 'nature', 'coloring pages', 'kids', 'printable'],
    images: [],
    featured: true,
  },
  {
    slug: 'princess-coloring-pages',
    title: 'Princess Coloring Pages',
    description:
      'Magical princess coloring pages with beautiful gowns, castles, and fairy tale scenes. Perfect for little dreamers.',
    metaDescription:
      'Free printable princess coloring pages for kids. Download beautiful princess designs with gowns and castles.',
    keywords: ['princess', 'fairy tale', 'castles', 'gowns', 'magic', 'coloring pages', 'kids', 'printable'],
    images: [],
    featured: true,
  },
  {
    slug: 'dinosaurs-coloring-pages',
    title: 'Dinosaurs Coloring Pages',
    description:
      'Exciting dinosaur coloring pages with T-Rex, Triceratops, and other prehistoric creatures. Educational and fun!',
    metaDescription:
      'Free printable dinosaur coloring pages for kids. Download T-Rex, Triceratops, and prehistoric creature designs.',
    keywords: ['dinosaurs', 'prehistoric', 't-rex', 'triceratops', 'educational', 'coloring pages', 'kids', 'printable'],
    images: [],
    featured: false,
  },
  {
    slug: 'flowers-coloring-pages',
    title: 'Flowers Coloring Pages',
    description:
      'Beautiful flower coloring pages with roses, sunflowers, and garden blooms. Perfect for nature lovers.',
    metaDescription:
      'Free printable flower coloring pages for kids. Download beautiful roses, sunflowers, and garden bloom designs.',
    keywords: ['flowers', 'roses', 'sunflowers', 'garden', 'nature', 'coloring pages', 'kids', 'printable'],
    images: [],
    featured: false,
  },
];
