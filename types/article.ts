import { Category, Status, Role } from "@prisma/client"

export interface Article {
  id: string
  title: string
  content: string
  category: Category
  status: Status
  imageUrl: string | null
  imageFile: Buffer | string | null // Updated to allow both Buffer and string
  videoUrl: string | null
  author: {
    id: string
    name: string | null
    role: Role | null
  } | null
  authorId: string | null
  scheduledPublishDate: Date | null
  approvalComments: string | null
  views: number
  likes: number
  shares: number
  createdAt: Date
  updatedAt: Date
}

export interface ArticleListProps {
  initialArticles: Article[]
  category?: Category
  totalArticles: number
  currentPage: number
  pageSize: number
}

export interface ArticleWhereInput {
  status?: Status
  category?: Category
  authorId?: string
  createdAt?: {
    gte?: Date
    lte?: Date
  }
}

export interface PendingArticle {
  id: string
  title: string
  author: { name: string | null }
  category: Category
  createdAt: Date
}

