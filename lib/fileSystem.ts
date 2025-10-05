import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import type { Category, CategoryImage } from '@/types';
import { defaultCategories } from '@/lib/data';

const DATA_DIR = path.join(process.cwd(), 'data');
const COLORING_PAGES_DIR = path.join(process.cwd(), 'public', 'coloring-pages');
const CATEGORIES_DB_PATH = path.join(DATA_DIR, 'categories.json');

const ORIGINAL_DIR_NAME = 'original';
const THUMBNAIL_DIR_NAME = 'thumbnails';
const ALLOWED_ORIGINAL_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);
const MIN_IMAGE_FILE_SIZE = 1024; // skip corrupt/tiny placeholder files

export function normalizeSlug(slug: string): string {
  const trimmed = (slug || '').trim().toLowerCase();
  const withoutDuplicates = trimmed.replace(/(-coloring-pages)+$/i, '-coloring-pages');
  const ascii = withoutDuplicates
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');
  const sanitized = ascii
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!sanitized) {
    return 'untitled-coloring-pages';
  }

  return sanitized.endsWith('-coloring-pages') ? sanitized : `${sanitized}-coloring-pages`;
}

function slugToDir(slug: string): string {
  return normalizeSlug(slug).replace(/-coloring-pages$/i, '');
}

function toPublicPath(dirName: string, folder: string, filename: string): string {
  return `/coloring-pages/${dirName}/${folder}/${filename}`;
}

export function ensureDirectoriesExist(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(COLORING_PAGES_DIR)) {
    fs.mkdirSync(COLORING_PAGES_DIR, { recursive: true });
  }
}

function ensureCategoryDirectories(slug: string): void {
  ensureDirectoriesExist();
  const dirName = slugToDir(slug);
  const baseDir = path.join(COLORING_PAGES_DIR, dirName);
  const originalDir = path.join(baseDir, ORIGINAL_DIR_NAME);
  const thumbnailDir = path.join(baseDir, THUMBNAIL_DIR_NAME);

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  if (!fs.existsSync(originalDir)) {
    fs.mkdirSync(originalDir, { recursive: true });
  }
  if (!fs.existsSync(thumbnailDir)) {
    fs.mkdirSync(thumbnailDir, { recursive: true });
  }
}

function normalizeCategory(rawCategory: any): Category {
  const slug = normalizeSlug(rawCategory?.slug ?? '');
  const keywords = Array.isArray(rawCategory?.keywords)
    ? rawCategory.keywords.map((keyword: any) => String(keyword)).filter(Boolean)
    : [];

  return {
    slug,
    title: String(rawCategory?.title ?? ''),
    description: String(rawCategory?.description ?? ''),
    metaDescription: String(rawCategory?.metaDescription ?? ''),
    keywords,
    images: [],
    featured: Boolean(rawCategory?.featured),
  };
}

export function getCategoriesFromDatabase(): Category[] {
  ensureDirectoriesExist();

  if (!fs.existsSync(CATEGORIES_DB_PATH)) {
    saveCategoriesToDatabase(defaultCategories);
    return defaultCategories.map((category) => ({ ...category }));
  }

  try {
    const fileContent = fs.readFileSync(CATEGORIES_DB_PATH, 'utf8');
    const parsed = JSON.parse(fileContent);

    if (!Array.isArray(parsed)) {
      throw new Error('Categories JSON must be an array');
    }

    const uniqueCategories = new Map<string, Category>();

    parsed.forEach((rawCategory) => {
      const normalized = normalizeCategory(rawCategory);
      if (!normalized.slug) {
        return;
      }
      if (!uniqueCategories.has(normalized.slug)) {
        uniqueCategories.set(normalized.slug, normalized);
      }
    });

    const categories = Array.from(uniqueCategories.values());

    if (!categories.length) {
      return defaultCategories.map((category) => ({ ...category }));
    }

    return categories;
  } catch (error) {
    console.error('Error reading categories database:', error);
    return defaultCategories.map((category) => ({ ...category }));
  }
}

export function saveCategoriesToDatabase(categories: Category[]): void {
  ensureDirectoriesExist();
  const serialisable = categories.map((category) => ({
    slug: normalizeSlug(category.slug),
    title: category.title,
    description: category.description,
    metaDescription: category.metaDescription,
    keywords: category.keywords,
    featured: Boolean(category.featured),
    images: [],
  }));

  fs.writeFileSync(CATEGORIES_DB_PATH, `${JSON.stringify(serialisable, null, 2)}\n`, 'utf8');
}

async function generateThumbnail(originalPath: string, thumbnailPath: string): Promise<void> {
  try {
    await sharp(originalPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(thumbnailPath);
  } catch (err) {
    // Fallback: copy original file as thumbnail placeholder to avoid build/runtime crashes
    try {
      fs.copyFileSync(originalPath, thumbnailPath);
    } catch {}
  }
}

async function buildCategoryImages(slug: string): Promise<CategoryImage[]> {
  ensureCategoryDirectories(slug);
  const dirName = slugToDir(slug);
  const baseDir = path.join(COLORING_PAGES_DIR, dirName);
  const originalDir = path.join(baseDir, ORIGINAL_DIR_NAME);
  const thumbnailDir = path.join(baseDir, THUMBNAIL_DIR_NAME);

  const entries = fs.existsSync(originalDir)
    ? fs.readdirSync(originalDir, { withFileTypes: true })
    : [];

  const images: CategoryImage[] = [];

  const originalFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => ALLOWED_ORIGINAL_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  for (const originalFilename of originalFiles) {
    const ext = path.extname(originalFilename);
    const basename = path.basename(originalFilename, ext);
    const originalPath = path.join(originalDir, originalFilename);
    const thumbnailFilename = `${basename}.webp`;
    const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);

    let originalStats: fs.Stats;
    try {
      originalStats = fs.statSync(originalPath);
    } catch (error) {
      console.warn('Skipping image (cannot stat):', originalPath, error);
      continue;
    }

    if (originalStats.size < MIN_IMAGE_FILE_SIZE) {
      try {
        fs.unlinkSync(originalPath);
      } catch {}
      try {
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
        }
      } catch {}
      console.warn('Skipping image (too small):', originalPath);
      continue;
    }

    let metadata;
    try {
      metadata = await sharp(originalPath).metadata();
    } catch (error) {
      console.warn('Skipping invalid image (metadata read failed):', originalPath, error);
      try {
        fs.unlinkSync(originalPath);
      } catch {}
      try {
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
        }
      } catch {}
      continue;
    }

    if (!fs.existsSync(thumbnailPath)) {
      await generateThumbnail(originalPath, thumbnailPath);
    }

    let thumbnailStats: fs.Stats;
    try {
      thumbnailStats = fs.statSync(thumbnailPath);
    } catch (error) {
      console.warn('Skipping image (thumbnail unavailable):', thumbnailPath, error);
      continue;
    }

    images.push({
      id: `${normalizeSlug(slug)}-${basename}`,
      originalFilename,
      originalPath: toPublicPath(dirName, ORIGINAL_DIR_NAME, originalFilename),
      thumbnailPath: toPublicPath(dirName, THUMBNAIL_DIR_NAME, thumbnailFilename),
      originalSize: originalStats.size,
      thumbnailSize: thumbnailStats.size,
      width: metadata.width,
      height: metadata.height,
      uploadDate: originalStats.mtime.toISOString(),
    });
  }

  return images;
}

export async function getCategoriesWithImages(): Promise<Category[]> {
  const categories = getCategoriesFromDatabase();
  return Promise.all(
    categories.map(async (category) => ({
      ...category,
      slug: normalizeSlug(category.slug),
      images: await buildCategoryImages(category.slug),
    }))
  );
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const normalizedSlug = normalizeSlug(slug);
  const categories = getCategoriesFromDatabase();
  const category = categories.find((item) => item.slug === normalizedSlug);

  if (!category) {
    return null;
  }

  return {
    ...category,
    images: await buildCategoryImages(category.slug),
  };
}

export function addCategory(category: Omit<Category, 'images'>): void {
  const categories = getCategoriesFromDatabase();
  const normalizedSlug = normalizeSlug(category.slug);

  if (categories.some((existing) => existing.slug === normalizedSlug)) {
    throw new Error(`Category with slug "${normalizedSlug}" already exists`);
  }

  const newCategory: Category = {
    slug: normalizedSlug,
    title: category.title,
    description: category.description,
    metaDescription: category.metaDescription,
    keywords: category.keywords,
    featured: Boolean(category.featured),
    images: [],
  };

  const updated = [...categories, newCategory];
  saveCategoriesToDatabase(updated);
  ensureCategoryDirectories(normalizedSlug);
}

export async function updateCategory(slug: string, updates: Partial<Category>): Promise<Category | null> {
  const categories = getCategoriesFromDatabase();
  const normalizedSlug = normalizeSlug(slug);
  const index = categories.findIndex((category) => category.slug === normalizedSlug);

  if (index === -1) {
    return null;
  }

  const current = categories[index];
  const updatedCategory: Category = {
    ...current,
    title: updates.title ?? current.title,
    description: updates.description ?? current.description,
    metaDescription: updates.metaDescription ?? current.metaDescription,
    keywords: updates.keywords ?? current.keywords,
    featured: updates.featured ?? current.featured,
    images: [],
  };

  categories[index] = updatedCategory;
  saveCategoriesToDatabase(categories);

  return {
    ...updatedCategory,
    images: await buildCategoryImages(updatedCategory.slug),
  };
}

export async function deleteCategory(slug: string): Promise<boolean> {
  const categories = getCategoriesFromDatabase();
  const normalizedSlug = normalizeSlug(slug);
  const filtered = categories.filter((category) => category.slug !== normalizedSlug);

  if (filtered.length === categories.length) {
    return false;
  }

  saveCategoriesToDatabase(filtered);

  const dirName = slugToDir(normalizedSlug);
  const categoryDir = path.join(COLORING_PAGES_DIR, dirName);

  if (fs.existsSync(categoryDir)) {
    fs.rmSync(categoryDir, { recursive: true, force: true });
  }

  return true;
}

export function scanFileSystemForCategories(): string[] {
  ensureDirectoriesExist();

  if (!fs.existsSync(COLORING_PAGES_DIR)) {
    return [];
  }

  return fs
    .readdirSync(COLORING_PAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function toTitleCase(input: string): string {
  return input
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function syncCategoriesWithFileSystem(): void {
  ensureDirectoriesExist();
  const categories = getCategoriesFromDatabase();
  const existingSlugs = new Set(categories.map((category) => category.slug));
  const syncedCategories = [...categories];

  const directories = scanFileSystemForCategories();

  directories.forEach((dirName) => {
    const slug = normalizeSlug(dirName);
    if (!existingSlugs.has(slug)) {
      syncedCategories.push({
        slug,
        title: `${toTitleCase(dirName)} Coloring Pages`,
        description: `Beautiful ${toTitleCase(dirName)} coloring pages for kids.`,
        metaDescription: `Free printable ${toTitleCase(dirName)} coloring pages for children.`,
        keywords: [dirName, 'coloring pages', 'kids', 'printable'],
        featured: false,
        images: [],
      });
      existingSlugs.add(slug);
    }
  });

  saveCategoriesToDatabase(syncedCategories);
  syncedCategories.forEach((category) => ensureCategoryDirectories(category.slug));
}
