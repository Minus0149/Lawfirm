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
import { Role } from '@prisma/client'
import { toast } from "sonner"

type User = {
  id: string;
  name: string | null;
  email: string;
  imageFile: Buffer | null | string;
  role: Role;
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "imageFile",
    header: "Avatar",
    cell: ({ row }) => (
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        {row.original.imageFile ? (
          <Image
            src={`data:image/jpeg;base64,${typeof row.original.imageFile === 'string' ? row.original.imageFile : Buffer.from(new Uint8Array(row.original.imageFile)).toString('base64')}`}
            alt={row.original.name || "User avatar"}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-xl">{row.original.name?.[0]?.toUpperCase()}</span>
          </div>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

      const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this user?')) {
          try {
            const response = await fetch(`/api/users/${user.id}`, {
              method: 'DELETE',
            })
            if (response.ok) {
              toast.success('User deleted successfully')
              // Refresh the table
              window.location.reload()
            } else {
              throw new Error('Failed to delete user')
            }
          } catch (error) {
            console.error('Error deleting user:', error)
            toast.error('Failed to delete user')
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
              <Link href={`/admin/users/${user.id}/edit`} className="flex items-center">
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

