import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    include: {
      children: {
        select: { slug: true },
      },
    },
  })

  return categories.flatMap((category) =>
    category.children.map((subcategory) => ({
      category: category.slug,
      subcategory: subcategory.slug,
    })),
  )
}

export default async function SubcategoryPage({ params }: { params: { category: string; subcategory: string } }) {
  const subcategory = await prisma.category.findFirst({
    where: {
      slug: params.subcategory,
      parent: { slug: params.category },
    },
    include: {
      parent: true,
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

  if (!subcategory) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{subcategory.name}</h1>
      <p className="mb-4">
        <Link href={`/${subcategory.parent?.slug}`} className="text-primary hover:underline">
          Back to {subcategory.parent?.name}
        </Link>
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subcategory.articles.map((article) => (
          <Card key={article.id}>
            <div className="relative w-full h-48 mb-4">
              <Image
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
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

