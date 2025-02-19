import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StyledLegalContent } from "@/components/styled-legal-content"

interface LegalDraftPreviewProps {
  legalDraft: {
    id: string
    title: string
    content: string
    category: string
    author?: {
      name: string
    }
    createdAt: Date
  }
}

export function LegalDraftPreview({ legalDraft }: LegalDraftPreviewProps) {
  const previewContent = legalDraft.content.slice(0, 200) + (legalDraft.content.length > 200 ? "..." : "")

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>
          <Link href={`/legal-drafts/${legalDraft.id}`} className="hover:text-primary transition-colors">
            {legalDraft.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <StyledLegalContent content={previewContent} className="line-clamp-3" />
        <div className="mt-4 text-sm text-muted-foreground">
          <span>By {legalDraft.author?.name || "Unknown"}</span>
          <span className="block">Category: {legalDraft.category}</span>
          <span className="block">{new Date(legalDraft.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}

