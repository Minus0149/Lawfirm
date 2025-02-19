"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/formatDate"
import { toast } from "@/components/ui/use-toast"

export type Experience = {
  id: string
  title: string
  company: string
  author: { name: string }
  startDate: Date
  endDate: Date | null
  status: string
  createdAt: Date
}

export const columns: ColumnDef<Experience>[] = [
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
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "author.name",
    header: "Author",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => formatDate(row.getValue("startDate")),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const endDate = row.getValue("endDate")
      return endDate ? formatDate(endDate instanceof Date ? endDate : new Date(String(endDate))) : "Present"
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const experience = row.original
      const router = useRouter()
      const [isLoading, setIsLoading] = useState(false)

      const handleDelete = async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/experiences/${experience.id}`, {
            method: "DELETE",
          })
          if (!response.ok) throw new Error("Failed to delete experience")
          toast({ title: "Experience deleted successfully" })
          router.refresh()
        } catch (error) {
          console.error("Error deleting experience:", error)
          toast({ title: "Error deleting experience", variant: "destructive" })
        } finally {
          setIsLoading(false)
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
              <Link href={`/admin/experiences/${experience.id}`}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/experiences/${experience.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
            {experience.status === "PENDING" && (
              <>
                <DropdownMenuItem onClick={() => approveExperience(experience.id)}>Approve</DropdownMenuItem>
                <DropdownMenuItem onClick={() => rejectExperience(experience.id)}>Reject</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

async function approveExperience(id: string) {
  try {
    const response = await fetch(`/api/experiences/${id}/approve`, {
      method: "POST",
    })
    if (!response.ok) throw new Error("Failed to approve experience")
    toast({ title: "Experience approved successfully" })
    // Refresh the data or update the UI as needed
    window.location.reload()
  } catch (error) {
    console.error("Error approving experience:", error)
    toast({ title: "Error approving experience", variant: "destructive" })
  }
}

async function rejectExperience(id: string) {
  try {
    const response = await fetch(`/api/experiences/${id}/reject`, {
      method: "POST",
    })
    if (!response.ok) throw new Error("Failed to reject experience")
    toast({ title: "Experience rejected successfully" })
    // Refresh the data or update the UI as needed
    window.location.reload()
  } catch (error) {
    console.error("Error rejecting experience:", error)
    toast({ title: "Error rejecting experience", variant: "destructive" })
  }
}

