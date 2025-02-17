"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PendingArticle } from '@/types/article'
import { Button } from "@/components/ui/button"
import { formatDate } from '@/lib/formatDate'
import Link from 'next/link'
import { ApprovalDialog } from '@/components/approval-dialog'

export const columns: ColumnDef<PendingArticle>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "author.name",
    header: "Author",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "createdAt",
    header: "Submitted On",
    cell: ({ row }) => formatDate(new Date(row.getValue("createdAt"))),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const article = row.original

      return (
        <div className="flex items-center gap-2">
          <Link href={`/admin/articles/${article.id}`} passHref>
            <Button variant="outline" size="sm">View</Button>
          </Link>
          <ApprovalDialog article={article} />
        </div>
      )
    },
  },
]

