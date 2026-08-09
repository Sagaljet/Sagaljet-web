export interface Category {
  id: number
  name: string
  description: string
}

export interface Project {
  id: number
  name: string
  description: string
  imageUrl: string[]
  link: string
  createAt: string
  updateAt: string
  industry: string
  order: number | null
  categoryId: number
  client: string
  category: Category
}

export interface ProjectsResponse {
  result: Project[]
  categories: Category[]
  success: boolean
}

