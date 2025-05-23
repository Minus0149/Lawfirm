import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        parent: {
          select: { name: true },
        },
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { name, slug, description, parentId } = body;

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Delete articles associated with subcategories
    const subcategories = await prisma.category.findMany({
      where: { parentId: params.id },
      select: { id: true },
    });

    const subcategoryIds = subcategories.map((subcategory) => subcategory.id);

    await prisma.article.deleteMany({
      where: { categoryId: { in: subcategoryIds } },
    });

    // Delete subcategories
    await prisma.category.deleteMany({
      where: { parentId: params.id },
    });

    // Delete articles associated with the main category
    await prisma.article.deleteMany({
      where: { categoryId: params.id },
    });

    // Delete the main category
    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Category, subcategories, and articles deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting category, subcategories, and articles:",
      error,
    );
    return NextResponse.json(
      { error: "Failed to delete category, subcategories, and articles" },
      { status: 500 },
    );
  }
}
