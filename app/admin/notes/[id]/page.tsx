import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"

export default async function NoteViewPage({ params }: { params: { id: string } }) {
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

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{note.title}</h1>
      <div className="mb-4">
        <p className="text-muted-foreground">
          By {note.author?.name || "Unknown"} | Category: {note.category?.name}
        </p>
        <p className="text-muted-foreground">Created: {new Date(note.createdAt).toLocaleDateString()}</p>
        <p className="text-muted-foreground">Downloads: {note.downloads}</p>
      </div>
      {note.description && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p>{note.description}</p>
        </div>
      )}
      <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: note.content }} />
      {note.fileUrl && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Attachment</h2>
          <a href={note.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            View Attachment
          </a>
        </div>
      )}
      <div className="flex space-x-4">
        <Link href={`/admin/notes/${note.id}/edit`}>
          <Button>Edit</Button>
        </Link>
        <Button variant="destructive">Delete</Button>
      </div>
    </div>
  )
}

