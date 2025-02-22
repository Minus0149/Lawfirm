"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Category, Status } from "@prisma/client"
import { formatDate } from '@/lib/formatDate'
import { stripHtmlAndTruncate } from '@/lib/textUtils'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

interface ArticleData {
 id: string
 title: string
 content: string
 category: Category
 status: Status
 author: {
   name: string | null
 }| null
 createdAt: Date
 updatedAt: Date
}

export const createColumns = (dateType: 'created' | 'updated', sortField: 'createdAt' | 'updatedAt'): ColumnDef<ArticleData>[] => [
 {
   accessorKey: "title",
   header: "Title",
 },
 {
   accessorKey: "author.name",
   header: "Author",
   cell: ({ row }) => row.original.author?.name || "Unknown",
 },
 {
   accessorKey: "category",
   header: "Category",
   cell: ({ row }) => row.original.category?.name || "Unknown",
 },
 {
   accessorKey: "status",
   header: "Status",
   cell: ({ row }) => {
    const status = row.getValue("status") as string
    console.log(status)
    const variant = status === "SCHEDULED" || status === "PENDING" ? "default" : status === "PUBLISHED" ? "success" : "destructive"
    return <Badge variant={variant}>{status}</Badge>
  },
 },
 {
   accessorKey: sortField,
   header: sortField === 'updatedAt' ? "Updated At" : "Created At",
   cell: ({ row }) => {
    const date = row.getValue(sortField) as Date
    return formatDate(date instanceof Date ? date : new Date(date)) // format date only if valid
  },
  
 },
 {
   accessorKey: "content",
   header: "Content Preview",
   cell: ({ row }) => stripHtmlAndTruncate(row.original.content, 100),
 },
 {
  id: "actions",
  cell: ({ row }) => {
    const article = row.original
    const router = useRouter()

    const handleDelete = async () => {
      if (confirm(`Are you sure you want to delete the article "${article.title}"?`)) {
        try {
          const response = await fetch(`/api/articles`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: article.id }),
          })

          if (!response.ok) {
            throw new Error('Failed to delete article')
          }

          const result = await response.json()

          toast.success('Article deleted successfully')
          router.refresh()
        } catch (error) {
          console.error('Error deleting article:', error)
          toast.error('Failed to delete article')
        }
      }
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/admin/articles/${article.id}/edit`} className="flex items-center">
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
},
]

