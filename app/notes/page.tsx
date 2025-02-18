import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle>
                <Link href={`/notes/${note.id}`} className="hover:text-primary">
                  {note.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: note.content.substring(0, 150) }}></p>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>By {note.author?.name || "Unknown"}</span>
                <span>{note.category.name}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

