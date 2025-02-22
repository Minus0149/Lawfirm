import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Advertisement } from "@/components/advertisement"

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  })

  return categories.map((category) => ({
    category: category.slug,
  }))
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await prisma.category.findFirst({
    where: { slug: params.category },
    include: {
      children: true,
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
      <Advertisement position="TOP_BANNER" category={category.id}/>
      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
      {/* {category.children.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Subcategories</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {category.children.map((subCategory) => (
              <Link key={subCategory.id} href={`/${category.slug}/${subCategory.slug}`}>
                <div className="p-4 border rounded-lg hover:bg-muted transition-colors">
                  <h3 className="text-lg font-medium">{subCategory.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )} */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {category.articles.length === 0 &&(
          <div className="text-xl text-muted-foreground">
            No articles found in this category.
          </div>
        )}
        {category.articles.map((article) => (
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

