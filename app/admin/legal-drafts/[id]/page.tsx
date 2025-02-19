import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { StyledLegalContent } from "@/components/styled-legal-content"

export default async function LegalDraftViewPage({ params }: { params: { id: string } }) {
  const legalDraft = await prisma.legalDraft.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: { name: true },
      },
    },
  })

  if (!legalDraft) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{legalDraft.title}</h1>
      <div className="mb-4">
        <p className="text-muted-foreground">
          By {legalDraft.author?.name || "Unknown"} | Category: {legalDraft.category}
        </p>
        <p className="text-muted-foreground">Created: {new Date(legalDraft.createdAt).toLocaleDateString()}</p>
      </div>
      <StyledLegalContent content={legalDraft.content} className="mb-6" />
      {legalDraft.fileUrl && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Attachment</h2>
          <a
            href={legalDraft.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            View Attachment
          </a>
        </div>
      )}
      <div className="flex space-x-4">
        <Link href={`/admin/legal-drafts/${legalDraft.id}/edit`}>
          <Button>Edit</Button>
        </Link>
        <Button variant="destructive">Delete</Button>
      </div>
    </div>
  )
}

