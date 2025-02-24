import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Advertisement } from "@/components/advertisement"
import ArticleList from "@/components/article-list"

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
            select: { id: true, name: true, role: true, image: true, imageFile: true },
          },
          category: {
            select: { id: true, name: true, slug: true, description: true, parentId: true, createdAt: true, updatedAt: true },
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
      
      <Advertisement position="TOP_BANNER"  category={subcategory.id}/>
      <h1 className="text-3xl font-bold mb-6">{subcategory.name}</h1>
      <p className="mb-4">
        <Link href={`/${subcategory.parent?.slug}`} className="text-primary dark:text-blue-500 hover:underline">
          Back to {subcategory.parent?.name}
        </Link>
      </p>
      <ArticleList
        initialArticles={subcategory.articles}
        totalArticles={subcategory.articles.length}
        currentPage={1}
        pageSize={10}
        category={subcategory}
      />
    </div>
  )
}

