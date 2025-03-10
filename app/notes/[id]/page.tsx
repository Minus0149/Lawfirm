import { notFound } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DownloadButton } from "@/components/download-button"
import { StyledLegalContent } from "@/components/styled-legal-content"
import type { Metadata } from "next"

interface NotePageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const note = await prisma.note.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: { name: true },
      },
      category: {
        select: { name: true },
      },
    },
  })

  if (!note) {
    return {}
  }

  return {
    title: note.title,
    description: note.description || note.content.substring(0, 160),
    authors: [{ name: note.author?.name || "Unknown" }],
    openGraph: {
      title: note.title,
      description: note.description || note.content.substring(0, 160),
      type: "article",
      publishedTime: note.createdAt.toISOString(),
      modifiedTime: note.updatedAt.toISOString(),
      authors: [note.author?.name || "Unknown"],
    },
  }
}
async function incrementDownloads(noteId: string, session: any) {
  const key = `note_${noteId}_download`
  if (session && !session.user[key]) {
    await prisma.note.update({
      where: { id: noteId },
      data: { downloads: { increment: 1 } },
    })
    session.user[key] = true
    return true
  }
  return false
}

export default async function NotePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const note = await prisma.note.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: { name: true },
      },
      category: {
        select: { name: true },
      },
    },
  })

  if (!note) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: note.title,
    description: note.description || note.content.substring(0, 160),
    author: {
      "@type": "Person",
      name: note.author?.name || "Unknown",
    },
    provider: {
      "@type": "Organization",
      name: "LexInvictus",
      sameAs: process.env.NEXT_PUBLIC_APP_URL,
    },
    dateCreated: note.createdAt.toISOString(),
    dateModified: note.updatedAt.toISOString(),
    educationalLevel: "graduate",
    learningResourceType: "notes",
    keywords: ["legal education", "law notes", note.category?.name || "legal resources"],
  }

  async function handleDownload() {
    "use server"
    const incremented = await incrementDownloads(params.id, session)
    if (incremented) {
      // Revalidate the page to show updated download count
      revalidatePath(`/notes/${params.id}`)
    }
    // Return the file URL for client-side download
    if (note) {
      return note.fileUrl
    }
    return ""
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{note.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            By {note.author?.name || "Unknown"} | Category: {note.category?.name}
          </div>
        </CardHeader>
        <CardContent>
        <StyledLegalContent content={note.content} className="mb-6" />
          {note.description && (
            <div className="mt-4 mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{note.description}</p>
            </div>
          )}
          {note.fileUrl && (
            <div className="mt-6">
              <DownloadButton handleDownload={handleDownload} />
              <p className="text-sm text-muted-foreground mt-2">Downloads: {note.downloads}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  )
}

