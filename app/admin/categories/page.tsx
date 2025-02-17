import { prisma } from "@/lib/prisma"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            parent: {
                select: { name: true },
            },
            articles: true,
            _count: {
                select: { articles: true },
            },
        },
        orderBy: { createdAt: "desc" },
    })
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
        </div>
    )
}
