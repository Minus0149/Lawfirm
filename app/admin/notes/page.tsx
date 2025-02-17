import { prisma } from "@/lib/prisma"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminNotesPage() {
  const notes = await prisma.note.findMany({
    include: {
      category: {
        select: { name: true },
      },
      author: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Notes</h1>
        <Link href="/admin/notes/new">
          <Button>Upload New Note</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={notes} />
    </div>
  )
}

