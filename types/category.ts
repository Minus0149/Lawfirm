export interface Category {
    id: string
    name: string
    slug: string
    description?: string | null
    parentId?: string | null
    children?: Category[]
    createdAt: Date
    updatedAt: Date
  }
  
  export interface CategoryWithChildren extends Category {
    children: CategoryWithChildren[]
  }
  
  