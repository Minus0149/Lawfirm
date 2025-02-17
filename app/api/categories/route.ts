import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [categories, totalCategories] = await Promise.all([
      prisma.category.findMany({
        include: {
          parent: {
            select: { name: true },
          },
          _count: {
            select: { articles: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.count(),
    ])
    // const categories = await prisma.category.findMany({
    //   include: {
    //     parent: {
    //       select: { name: true },
    //     },
    //     _count: {
    //       select: { articles: true },
    //     },
    //   },
    //   orderBy: { createdAt: "desc" },
    // })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description, parentId } = body

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentId: parentId || null,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

