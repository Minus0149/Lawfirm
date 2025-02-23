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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Enquiry } from "@/types/enquiry"
import Link from "next/link"

export const columns: ColumnDef<Enquiry>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Subject
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant = status === "ACTIVE" ? "default" : status === "COMPLETE" ? "success" : "destructive"

      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const enquiry = row.original
      const router = useRouter()
      const [isLoading, setIsLoading] = useState(false)
      const [showResponseDialog, setShowResponseDialog] = useState(false)
      const [response, setResponse] = useState(enquiry.response || "")

      const handleStatusChange = async (status: string) => {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/enquiries/${enquiry.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          })

          if (!response.ok) throw new Error("Failed to update status")

          toast.success("Status updated successfully", {
            description: `Enquiry status has been updated to ${status}.`,
          })
          window.location.reload()
        } catch (error) {
          console.error("Error updating status:", error)
          toast.error("Error updating status", {
            description: "Please try again later.",
          })
        } finally {
          setIsLoading(false)
        }
      }

      const handleResponse = async () => {
        setIsLoading(true)
        try {
          const res = await fetch(`/api/enquiries/${enquiry.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ response }),
          })

          if (!res.ok) throw new Error("Failed to save response")

          toast.success("Response saved successfully", {
            description: "Your response has been saved.",
          })
          setShowResponseDialog(false)
          window.location.reload()
        } catch (error) {
          console.error("Error saving response:", error)
          toast.error("Error saving response", {
            description: "Please try again later.",
          })
        } finally {
          setIsLoading(false)
        }
      }

      return (
        <>
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
                <Link href={`/admin/enquiries/${enquiry.id}`}>View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowResponseDialog(true)}>Respond</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleStatusChange("ACTIVE")} disabled={isLoading}>
                Mark as Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("COMPLETE")} disabled={isLoading}>
                Mark as Complete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("DENIED")} disabled={isLoading}>
                Mark as Denied
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Respond to Enquiry</DialogTitle>
                <DialogDescription>Write your response to this enquiry below.</DialogDescription>
              </DialogHeader>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
                rows={5}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowResponseDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleResponse} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Response"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]

