import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Organize categories into a hierarchical structure
    const organizedCategories = categories
      .filter((category) => !category.parent)
      .map((category) => ({
        ...category,
        children: categories.filter((child) => child.parent?.id === category.id),
      }))

    return NextResponse.json(organizedCategories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description, parentId } = body

    // Validate that the parent category exists if parentId is provided
    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      })

      if (!parentCategory) {
        return NextResponse.json({ error: "Parent category not found" }, { status: 404 })
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentId: parentId === "0" ? null : parentId,
      },
      include: {
        parent: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

