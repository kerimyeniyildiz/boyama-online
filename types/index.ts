export interface CategoryImage {
  id: string;
  originalFilename: string;
  originalPath: string;
  thumbnailPath: string;
  originalSize: number;
  thumbnailSize: number;
  width?: number;
  height?: number;
  uploadDate: string;
}

export interface Category {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  images: CategoryImage[];
  featured?: boolean;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  keywords: string[];
}

export interface ImageCardProps {
  src: string;
  alt: string;
  title?: string;
  onDownload: () => void;
}

export interface CategoryCardProps {
  category: Category;
}

export interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

export interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

export interface SkeletonProps {
  className?: string;
}

// JSON-LD Schema Types
export interface WebSiteSchema {
  '@context': string;
  '@type': 'WebSite';
  name: string;
  description: string;
  url: string;
  publisher: OrganizationSchema;
  potentialAction?: SearchActionSchema;
  mainEntity?: ItemListSchema;
}

export interface CreativeWorkSchema {
  '@context': string;
  '@type': 'CreativeWork';
  name: string;
  description: string;
  url: string;
  publisher: OrganizationSchema;
  keywords: string;
  datePublished: string;
  dateModified: string;
  isAccessibleForFree: boolean;
  educationalUse: string;
  audience: AudienceSchema;
  hasPart?: ImageObjectSchema[];
}

export interface OrganizationSchema {
  '@type': 'Organization';
  name: string;
  url: string;
}

export interface SearchActionSchema {
  '@type': 'SearchAction';
  target: string;
  'query-input': string;
}

export interface ItemListSchema {
  '@type': 'ItemList';
  name: string;
  description: string;
  numberOfItems: number;
  itemListElement: CreativeWorkSchema[];
}

export interface AudienceSchema {
  '@type': 'Audience';
  audienceType: string;
}

export interface ImageObjectSchema {
  '@type': 'ImageObject';
  name: string;
  description: string;
  url: string;
  encodingFormat: string;
  isAccessibleForFree: boolean;
}

export interface BreadcrumbListSchema {
  '@context': string;
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItemSchema[];
}

export interface BreadcrumbItemSchema {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}
