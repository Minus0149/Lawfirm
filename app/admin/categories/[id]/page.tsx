import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CategoryViewPage({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      parent: true,
      children: true,
      articles: {
        include: {
          author: {
            select: { name: true },
          },
        },
      },
    },
  })

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <div className="flex gap-2">
          <Link href={`/admin/categories/${category.id}/edit`}>
            <Button>Edit Category</Button>
          </Link>
          <Button variant="destructive">Delete Category</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Slug</h3>
            <p className="text-muted-foreground">{category.slug}</p>
          </div>
          {category.description && (
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          )}
          {category.parent && (
            <div>
              <h3 className="font-semibold">Parent Category</h3>
              <Link href={`/admin/categories/${category.parent.id}`} className="text-primary hover:underline">
                {category.parent.name}
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {category.children.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subcategories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {category.children.map((child) => (
                <Link key={child.id} href={`/admin/categories/${child.id}`}>
                  <div className="p-4 border rounded-lg hover:bg-muted">
                    <h3 className="font-semibold">{child.name}</h3>
                    <p className="text-sm text-muted-foreground">{child.slug}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Articles in this Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {category.articles.map((article) => (
              <div key={article.id} className="p-4 border rounded-lg">
                <Link href={`/admin/articles/${article.id}`} className="font-semibold hover:text-primary">
                  {article.title}
                </Link>
                <p className="text-sm text-muted-foreground">By {article.author?.name || "Unknown"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

