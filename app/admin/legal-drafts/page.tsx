import { prisma } from "@/lib/prisma"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function LegalDraftsPage() {
  const legalDrafts = await prisma.legalDraft.findMany({
    include: {
      author: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Legal Drafts</h1>
        <Link href="/admin/legal-drafts/new">
          <Button>Add New Legal Draft</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={legalDrafts.map(draft => ({ ...draft, author: draft.author || { name: "Unknown" } }))} />
    </div>
  )
}

