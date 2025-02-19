import { prisma } from "@/lib/prisma"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pagination } from "@/components/pagination"

const ITEMS_PER_PAGE = 10

export default async function AdminLegalDraftsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const skip = (page - 1) * ITEMS_PER_PAGE

  const [legalDrafts, totalLegalDrafts] = await Promise.all([
    prisma.legalDraft.findMany({
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.legalDraft.count(),
  ])

  const totalPages = Math.ceil(totalLegalDrafts / ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Legal Drafts</h1>
        <Link href="/admin/legal-drafts/new">
          <Button>Add New Legal Draft</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={legalDrafts.map(draft => ({ ...draft, author: draft.author || { name: "Unknown" } }))} />
      <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/legal-drafts" />
    </div>
  )
}

