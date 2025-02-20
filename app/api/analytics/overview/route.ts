import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : new Date(0)
  const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : new Date()

  try {
    const [totalUsers, totalArticles, totalViews, totalAds, newUsers, newArticles, contentDistribution, trafficData, categories] =
      await Promise.all([
        prisma.user.count(),
        prisma.article.count(),
        prisma.article.aggregate({ _sum: { views: true } }),
        prisma.advertisement.count(),
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            },
          },
        }),
        prisma.article.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            },
          },
        }),
        prisma.article.groupBy({
          by: ["categoryId"],
          _count: {
            id: true,
          },
          orderBy: {
            _count: {
              id: "desc",
            },
          },
        }),
        prisma.article.groupBy({
          by: ["createdAt"],
          _sum: {
            views: true,
          },
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        }),
        prisma.category.findMany({include: {children: true}}),
      ])

    const averageCTR = await prisma.advertisement
      .aggregate({
        _avg: {
          clicks: true,
          views: true,
        },
      })
      .then((result) => {
        const avgClicks = result._avg.clicks || 0
        const avgViews = result._avg.views || 1
        return (avgClicks / avgViews) * 100
      })

    const categoryMap = categories.reduce((acc, category) => {
      acc[category.id] = category.name
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({
      totalUsers,
      totalArticles,
      totalViews: totalViews._sum.views || 0,
      totalAds,
      newUsers,
      newArticles,
      averageCTR: averageCTR.toFixed(2),
      contentDistribution: contentDistribution.map((item) => ({
      name: categoryMap[item.categoryId] || "Unknown",
      value: item._count.id,
      })),
      trafficData: trafficData.map((item) => ({
      date: item.createdAt,
      views: item._sum.views || 0,
      })),
    })
  } catch (error) {
    console.error("Error fetching overview analytics:", error)
    return NextResponse.json({ error: "Failed to fetch overview analytics" }, { status: 500 })
  }
}

