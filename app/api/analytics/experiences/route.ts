import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 10
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const status = searchParams.get("status") === "all" ? "" : searchParams.get("status")
  
  const skip = (page - 1) * limit

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

  const statusFilter = {
    ...(status
      ? {
          status,
        }
      : {}),
  }

  try {
    const [experiences, totalExperiences, statusCounts, submissionTrends] = await Promise.all([
      prisma.experience.findMany({
        where: {
          ...dateFilter,
          ...statusFilter,
        },
        include: {
          author: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.experience.count({
        where: {
          ...dateFilter,
          ...statusFilter,
        },
      }),
      prisma.experience.groupBy({
        by: ["status"],
        _count: true,
      }),
      prisma.experience.findMany({
        where: {
          createdAt: {
            gte: startDate ? new Date(startDate) : new Date(0),
            lte: endDate ? new Date(endDate) : new Date(),
          },
        },
        select: {
          createdAt: true,
        },
      }).then((experiences) => {
        const trends = experiences.reduce((acc: { [key: string]: number }, exp) => {
          const date = exp.createdAt.toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date]++;
          return acc;
        }, {});
        return Object.keys(trends).map((date) => ({
          date,
          submissions: trends[date],
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }),
    ])

    const approvedCount = statusCounts.find((sc) => sc.status === "APPROVED")?._count || 0
    const approvalRate = ((approvedCount / totalExperiences) * 100).toFixed(1)

    const statusDistribution = statusCounts.map((sc) => ({
      status: sc.status,
      value: sc._count,
    }))

    return NextResponse.json({
      experiences,
      totalExperiences,
      approvedCount,
      approvalRate,
      statusDistribution,
      submissionTrends,
      newExperiences: await prisma.experience.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      }),
      uniqueContributors: await prisma.experience
        .groupBy({
          by: ["authorId"],
          _count: true,
        })
        .then((result) => result.length),
      totalViews: 0,
      averageViews: 0 
    })
  } catch (error) {
    console.error("Error fetching experiences analytics:", error)
    return NextResponse.json({ error: "Failed to fetch experiences analytics" }, { status: 500 })
  }
}

