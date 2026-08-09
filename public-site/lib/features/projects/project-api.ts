// redux/api/projectsApi.ts
import { Url } from "@/lib/url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Category {
  id: number;
  name: string;
  description?: string | null;
}

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  slug?: string | null;
  imageUrl: string[];
  link?: string | null;
  createAt: string;
  updateAt: string;
  industry?: string | null;
  order?: number | null;
  categoryId: number;
  category: Category;
  client: string;
}

interface ProjectsResponse {
  success: boolean;
  result: Project[];
  categories: Category[];
}

interface ProjectResponse {
  success: boolean;
  result: Project;
}

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Url,
  }),
  tagTypes: ["Project", "Projects"],
  endpoints: (builder) => ({
    // Get all projects with categories
    getProjects: builder.query<ProjectsResponse, void>({
      query: () => "/project/get-projects",
      providesTags: ["Projects"],
    }),

    // Get single project by slug
    getProjectBySlug: builder.query<Project, string>({
      query: (slug) => `/project/get-project-by-slug/${slug}`,
      transformResponse: (response: ProjectResponse) => response.result,
      providesTags: (result, error, slug) => [{ type: "Project", id: slug }],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetProjectsQuery, useGetProjectBySlugQuery } = projectsApi;

// Export endpoints for server-side usage
export const { getProjects, getProjectBySlug } = projectsApi.endpoints;
