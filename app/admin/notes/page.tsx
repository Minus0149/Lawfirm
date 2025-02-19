import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Pagination } from "@/components/pagination"
import { NotesFilter } from "@/components/notes-filter"

const ITEMS_PER_PAGE = 10

export default async function AdminNotesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined
  const categoryId = typeof searchParams.category === "string" ? searchParams.category : undefined

  const skip = (page - 1) * ITEMS_PER_PAGE
  const where: any = {}
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }
  if (categoryId && categoryId !== "all_categories") where.categoryId = categoryId

  const [notes, totalNotes, categories] = await Promise.all([
    prisma.note.findMany({
      where,
      include: {
        author: {
          select: { name: true },
        },
        category: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.note.count({ where }),
    prisma.category.findMany({ select: { id: true, name: true } }),
  ])

  const totalPages = Math.ceil(totalNotes / ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Notes</h1>
        <Link href="/admin/notes/new">
          <Button>Create New Note</Button>
        </Link>
      </div>
      <NotesFilter categories={categories} />
      <DataTable columns={columns} data={notes} />
      <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/notes" />
    </div>
  )
}

