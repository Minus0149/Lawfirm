import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function NotesPage() {
  const notes = await prisma.note.findMany({
    include: {
      category: {
        select: { name: true, slug: true },
      },
      author: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Study Notes</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle>{note.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{note.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">By {note.author.name}</p>
                  <p className="text-sm text-muted-foreground">Category: {note.category.name}</p>
                </div>
                <Button asChild>
                  <a href={note.fileUrl} download>
                    Download
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

