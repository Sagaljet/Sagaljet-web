// lib/utils.ts (add to your existing utils file)

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes a string to a URL-friendly slug
 * Matches the backend normalization logic
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/(^-|-$)/g, ""); // Remove leading/trailing hyphens
}

/**
 * Gets the appropriate slug for a project
 * Uses project.slug if available, otherwise generates from name
 */
export function getProjectSlug(project: { slug?: string | null; name: string }): string {
  return project.slug || slugify(project.name);
}

/**
 * Gets the appropriate slug for a blog
 * Uses blog.slug if available, otherwise generates from title
 */
export function getBlogSlug(blog: { slug?: string | null; title: string }): string {
  return blog.slug || slugify(blog.title);
}