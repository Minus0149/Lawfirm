import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileIcon } from "lucide-react"

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
        <Link href="/legal-drafts/new">
          <Button>Create New Draft</Button>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {legalDrafts.map((draft) => (
          <Card key={draft.id}>
            <CardHeader>
              <CardTitle>
                <Link href={`/legal-drafts/${draft.id}`} className="hover:text-primary">
                  {draft.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{draft.content.substring(0, 150)}...</p>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>By {draft.author?.name || "Unknown"}</span>
                <span>{draft.category}</span>
              </div>
              {draft.fileUrl && (
                <a
                  href={draft.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center mt-2 text-primary hover:underline"
                >
                  <FileIcon className="w-4 h-4 mr-1" /> Attachment
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

