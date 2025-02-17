"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Advertisement } from '@prisma/client'
import { formatDate } from '@/lib/formatDate'
import { toast } from "@/components/ui/use-toast"

export const columns: ColumnDef<Advertisement>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      row.original.image || row.original.imageFile ? (
        <div className="relative w-16 h-16">
          <Image
            src={row.original.image || `data:image/jpeg;base64,${Array.isArray(row.original.imageFile) ? Buffer.from(row.original.imageFile).toString('base64') : row.original.imageFile}`}
            alt="Ad"
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        </div>
      ) : (
        <span>No image</span>
      )
    ),
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => (
      <a href={row.original.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {row.original.link}
      </a>
    ),
  },
  {
    accessorKey: "placement",
    header: "Placement",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => formatDate(row.original.startDate instanceof Date ? row.original.startDate : new Date(row.original.startDate)),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => formatDate(row.original.endDate instanceof Date ? row.original.endDate : new Date(row.original.endDate)),
  },
  {
    accessorKey: "views",
    header: "Views",
  },
  {
    accessorKey: "clicks",
    header: "Clicks",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ad = row.original

      const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this advertisement?')) {
          try {
            const response = await fetch(`/api/advertisements/${ad.id}`, {
              method: 'DELETE',
            })
            if (response.ok) {
              toast({
                title: "Success",
                description: "Advertisement deleted successfully",
              })
              // Refresh the table
              window.location.reload()
            } else {
              throw new Error('Failed to delete advertisement')
            }
          } catch (error) {
            console.error('Error deleting advertisement:', error)
            toast({
              title: "Error",
              description: "Failed to delete advertisement",
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
            <DropdownMenuItem asChild>
              <Link href={`/admin/advertisements/${ad.id}/edit`} className="flex items-center">
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

