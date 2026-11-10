import { getCollection } from 'astro:content';
import type { galleryKinds } from '../content.config';
import { sortBlogPostsForArchive, sortByDateDesc } from '../utils/content-dates';

export type GalleryKind = (typeof galleryKinds)[number];

// Route per kind, e.g. photo -> /photos
export const galleryRoutes: Record<GalleryKind, string> = {
  photo: '/photos',
  drawing: '/drawings',
};

// Published posts, newest first. `count` omitted returns all.
export async function getLatestPosts(count?: number) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return sortBlogPostsForArchive(posts).slice(0, count);
}

// Published gallery items of one kind, newest first. `count` omitted returns all.
export async function getGallery(kind: GalleryKind, count?: number) {
  const items = await getCollection('gallery', ({ data }) => !data.draft && data.kind === kind);

  return sortByDateDesc(items).slice(0, count);
}

export async function getAllGallery() {
  return getCollection('gallery', ({ data }) => !data.draft);
}

export type GalleryItem = Awaited<ReturnType<typeof getAllGallery>>[number];
export type BlogPost = Awaited<ReturnType<typeof getLatestPosts>>[number];
