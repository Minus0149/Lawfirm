export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    parentId?: string
    children?: Category[]
    createdAt: Date
    updatedAt: Date
  }
  
  export interface CategoryWithChildren extends Category {
    children: CategoryWithChildren[]
  }
  
  