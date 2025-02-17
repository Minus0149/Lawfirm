"use client"

import { DataTable } from "@/components/ui/data-table"
import { createColumns } from "./columns"
import { Article } from "@/types/article"

interface ArticleTableProps {
  articles: Article[]
  dateType: 'created' | 'updated'
  sortField: 'updatedAt' | 'createdAt'
}

export function ArticleTable({ articles, dateType,sortField }: ArticleTableProps) {
  const columns = createColumns(dateType,sortField)
  return <DataTable columns={columns} data={articles} />
}

