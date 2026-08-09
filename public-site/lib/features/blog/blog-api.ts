// redux/api/blogsApi.ts
import { Url } from "@/lib/url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Single blog type
export interface Blog {
  id: number;
  title: string;
  content: string;
  slug?: string | null;
  author: string;
  image?: string | null;
  createAt: string; // ISO string when returned via JSON
  updateAt: string;
}

// Response types
interface BlogsResponse {
  success: boolean;
  result: Blog[];
}

interface BlogResponse {
  success: boolean;
  result: Blog;
}

export const blogsApi = createApi({
  reducerPath: "blogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Url,
  }),
  tagTypes: ["Blog", "Blogs"],
  endpoints: (builder) => ({
    // Get all blogs
    getAllBlogs: builder.query<Blog[], void>({
      query: () => "/blog/all-blogs",
      transformResponse: (response: BlogsResponse) => response.result || [],
      providesTags: ["Blogs"],
    }),

    // Get single blog by slug
    getBlogBySlug: builder.query<Blog, string>({
      query: (slug) => `/blog/get-blog-by-slug/${slug}`,
      transformResponse: (response: BlogResponse) => response.result,
      providesTags: (result, error, slug) => [
        { type: "Blog", id: slug },
        { type: "Blog", id: result?.id },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllBlogsQuery,
  useGetBlogBySlugQuery,
} = blogsApi;

// Export endpoints for server-side usage
export const {
  getAllBlogs,
  getBlogBySlug,
} = blogsApi.endpoints;