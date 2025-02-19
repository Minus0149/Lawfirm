import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Pagination } from "@/components/pagination"
import { LegalDraftsFilter } from "@/components/legal-drafts-filter"

const ITEMS_PER_PAGE = 10

export default async function AdminLegalDraftsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined

  const skip = (page - 1) * ITEMS_PER_PAGE
  const where: any = {}
  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: "insensitive" } },
      { content: { contains: search as string, mode: "insensitive" } },
    ]
  }
  if (category && category !== "all") where.category = category

  const [legalDrafts, totalLegalDrafts] = await Promise.all([
    prisma.legalDraft.findMany({
      where,
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.legalDraft.count({ where }),
  ])

  const totalPages = Math.ceil(totalLegalDrafts / ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Legal Drafts</h1>
        <Link href="/admin/legal-drafts/new">
          <Button>Create New Legal Draft</Button>
        </Link>
      </div>
      <LegalDraftsFilter />
      <DataTable columns={columns} data={legalDrafts.map(draft => ({ ...draft, author: draft.author || { name: "Unknown" } }))} />
      <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/legal-drafts" />
    </div>
  )
}

