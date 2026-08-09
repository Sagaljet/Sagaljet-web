import { Url } from "../url";

export async function getProjectBySlug(slug: string) {
  try {
    const response = await fetch(`${Url}/project/get-project-by-slug/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch project");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}
