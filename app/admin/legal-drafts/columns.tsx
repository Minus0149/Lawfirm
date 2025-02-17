"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export type LegalDraft = {
  id: string
  title: string
  category: string
  author: { name: string }
  createdAt: Date
}

const handleDeleteLegalDraft = async (id: string) => {
  if (confirm("Are you sure you want to delete this legal draft?")) {
    try {
      const response = await fetch(`/api/legal-drafts/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete legal draft")

      toast({ title: "Legal draft deleted successfully" })
      // Refresh the data table
      window.location.reload()
    } catch (error) {
      console.error("Error deleting legal draft:", error)
      toast({ title: "Error deleting legal draft", variant: "destructive" })
    }
  }
}

export const columns: ColumnDef<LegalDraft>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "author.name",
    header: "Author",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const legalDraft = row.original

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
            <DropdownMenuItem>
              <Link href={`/admin/legal-drafts/${legalDraft.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/admin/legal-drafts/${legalDraft.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleDeleteLegalDraft(legalDraft.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

