import { prisma } from "@/lib/prisma"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pagination } from "@/components/pagination"

const ITEMS_PER_PAGE = 10

export default async function AdminCategoriesPage({
    searchParams,
  }: {
    searchParams: { [key: string]: string | string[] | undefined }
  }) {
    const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
    const skip = (page - 1) * ITEMS_PER_PAGE
  
    const [categories, totalCategories] = await Promise.all([
      prisma.category.findMany({
        include: {
          parent: {
            select: { name: true },
          },
          _count: {
            select: { articles: true },
          },
          articles: true
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: ITEMS_PER_PAGE,
      }),
      prisma.category.count(),
    ])
  
    const totalPages = Math.ceil(totalCategories / ITEMS_PER_PAGE)
    const updatedCategories = categories.map((c) => ({
        ...c,
        _count: {
          ...c._count,
          articles: c.articles.length, // Update count based on actual articles array
        },
    }));
      
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Categories</h1>
                <Link href="/admin/categories/new">
                    <Button>Add New Category</Button>
                </Link>
            </div>
            <DataTable columns={columns} data={updatedCategories} />
            <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/categories" />
        </div>
    )
}
