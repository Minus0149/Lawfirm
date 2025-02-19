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
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export type Note = {
  id: string
  title: string
  category: { name: string }
  author: { name: string }
  downloads: number
  createdAt: Date
}

export const columns: ColumnDef<Note>[] = [
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
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "author.name",
    header: "Author",
  },
  {
    accessorKey: "downloads",
    header: "Downloads",
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
      const note = row.original
      const router = useRouter()

      const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this note?")) {
          try {
            const response = await fetch(`/api/notes/${note.id}`, {
              method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete note")

            toast({
              title: "Note deleted successfully",
              description: `The note "${note.title}" has been deleted.`,
            })
            router.refresh()
          } catch (error) {
            console.error("Error deleting note:", error)
            toast({
              title: "Error deleting note",
              description: "There was a problem deleting the note. Please try again.",
              variant: "destructive",
            })
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
            <DropdownMenuItem>
              <Link href={`/admin/notes/${note.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/admin/notes/${note.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

