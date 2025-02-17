import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  })

  return categories.map((category) => ({
    category: category.slug,
  }))
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
    include: {
      articles: {
        where: { status: "PUBLISHED" },
        include: {
          author: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {category.articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle>
                <Link href={`/article/${article.id}`} className="hover:text-primary">
                  {article.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{article.content.substring(0, 150)}...</p>
              <p className="text-sm text-muted-foreground">By {article.author?.name || "Unknown"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

