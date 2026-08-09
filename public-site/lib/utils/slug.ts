// src/lib/utils/slug.ts

/**
 * Convert title to URL-friendly slug
 * "Facebook Post Design" -> "facebook-post-design"
 */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-")      // Replace spaces with dashes
    .replace(/-+/g, "-")       // Replace multiple dashes with single dash
    .replace(/^-|-$/g, "");    // Remove leading/trailing dashes
}

/**
 * Convert slug back to title format (for display)
 * "facebook-post-design" -> "Facebook Post Design"
 */
export function slugToTitle(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}