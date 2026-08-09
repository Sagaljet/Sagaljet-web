import { Url } from "./url";

// Blog data types and API integration
export interface Blog {
  id: number;
  title: string;
  author: string;
  image: string;
  createAt: string;
  updateAt: string;
  [key: string]: any; // For dynamic or unknown fields
}

export interface BlogResponse {
  result: Blog[];
  isSuccess: boolean;
}

// Extended BlogPost type for component usage
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

const API_URL = `${Url}/blog/all-blogs`;

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper function to calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Transform API Blog to BlogPost
function transformBlogToPost(blog: Blog): BlogPost {
  return {
    id: blog.id,
    slug: generateSlug(blog.title),
    title: blog.title,
    excerpt: blog.description || "Read more about this topic...",
    content: blog.content || blog.description || "",
    author: blog.author,
    date: blog.createAt,
    readTime: calculateReadTime(blog.content || blog.description || ""),
    category: blog.category || "General",
    image: blog.image,
  };
}

// Fetch all blog posts from API
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(API_URL, {
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error("Failed to fetch blog posts");
    }

    const data: BlogResponse = await response.json();

    if (!data.isSuccess || !data.result) {
      return [];
    }

    return data.result.map(transformBlogToPost);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

// Get a single blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}
