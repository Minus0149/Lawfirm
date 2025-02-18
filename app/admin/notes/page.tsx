import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"

export default async function NotesPage() {
  const notes = await prisma.note.findMany({
    include: {
      author: {
        select: { name: true },
      },
      category: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notes</h1>
        <Link href="/admin/notes/new">
          <Button>Create New Note</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={notes} />
    </div>
  )
}

