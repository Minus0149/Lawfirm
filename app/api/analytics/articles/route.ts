import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const category = searchParams.get("category") === "all" ? "" : searchParams.get("category")
  const search = searchParams.get("search")
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  
  const skip = (page - 1) * limit;

  const dateFilter = {
    ...(startDate && endDate
      ? {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }
      : {}),
  }

  const searchFilter = {
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } } as any,
            { content: { contains: search, mode: "insensitive" } } as any,
          ],
        }
      : {}),
  }

  const categoryFilter = {
    ...(category
      ? {
          category: {
            name: category,
          },
        }
      : {}),
  }

  try {
    const articles = await prisma.article.findMany({
      where: {
        ...dateFilter,
        ...searchFilter,
        ...categoryFilter,
      },
      include: {
        category: {
          select: { name: true },
        },
        author: {
          select: { name: true },
        },
      },
      skip,
      take: limit,
      orderBy: {
        views: "desc",
      },
    })
    const totalArticles = await prisma.article.count({where: {
      ...dateFilter,
      ...searchFilter,
      ...categoryFilter,
    }})
    // Calculate views over time
    const viewsGroup = await prisma.article.groupBy({
      by: ['createdAt'],
      _sum: {
        views: true,
      },
      where: {
        createdAt: {
          gte: startDate ? new Date(startDate) : new Date(0),
          lte: endDate ? new Date(endDate) : new Date(),
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    const viewsOverTime = viewsGroup.map(group => ({
      date: group.createdAt,
      views: group._sum.views,
    }))

    return NextResponse.json({
      articles,
      viewsOverTime,
      totalArticles
    })
  } catch (error) {
    console.error("Error fetching article analytics:", error)
    return NextResponse.json({ error: "Failed to fetch article analytics" }, { status: 500 })
  }
}

