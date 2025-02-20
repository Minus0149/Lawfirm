import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const location = searchParams.get("location")=== "all" ? "" : searchParams.get("location")
  const category = searchParams.get("category") === "all" ? "" : searchParams.get("category")
  const search = searchParams.get("search")
  
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  
  const skip = (page - 1) * limit;

  const dateFilter = {
    ...(startDate && endDate
      ? {
          startDate: {
            gte: new Date(startDate),
          },
          endDate: {
            lte: new Date(endDate),
          },
        }
      : {}),
  }

  const searchFilter = {
    ...(search
      ? {
          OR: [{ title: { contains: search, mode: "insensitive" } } as any],
        }
      : {}),
  }

  const locationFilter = {
    ...(location
      ? {
          location,
        }
      : {}),
  }

  const categoryFilter = {
    ...(category
      ? {
          category,
        }
      : {}),
  }

  try {
    const advertisements = await prisma.advertisement.findMany({
      where: {
        ...dateFilter,
        ...searchFilter,
        ...locationFilter,
        ...categoryFilter,
      },
      orderBy: {
        views: "desc",
      },
      skip,
      take: limit,
    })

    // Calculate performance metrics by location
    const performanceByLocation = await prisma.advertisement.groupBy({
      by: ["location"],
      _sum: {
        views: true,
        clicks: true,
      },
      where: {
        ...dateFilter,
        ...categoryFilter,
      },
    })

    // Calculate performance metrics by category
    const performanceByCategory = await prisma.advertisement.groupBy({
      by: ["category"],
      _sum: {
        views: true,
        clicks: true,
      },
      where: {
        ...dateFilter,
        ...locationFilter,
        category: { not: null },
      },
    })

    // Transform the data for the response
    const transformedAds = advertisements.map((ad) => ({
      ...ad,
      ctr: ad.views > 0 ? ad.clicks / ad.views : 0,
    }))

    const transformedLocationPerformance = performanceByLocation.map((loc) => ({
      location: loc.location,
      views: loc._sum.views || 0,
      clicks: loc._sum.clicks || 0,
    }))

    const transformedCategoryPerformance = performanceByCategory.map((cat) => ({
      category: cat.category,
      views: cat._sum.views || 0,
      clicks: cat._sum.clicks || 0,
    }))

    const totalAds = await prisma.advertisement.count({
      where: {
        ...dateFilter,
        ...searchFilter,
        ...locationFilter,
        ...categoryFilter,
      },
    })

    return NextResponse.json({
      advertisements: transformedAds,
      performanceByLocation: transformedLocationPerformance,
      performanceByCategory: transformedCategoryPerformance,
      totalAds
    })
  } catch (error) {
    console.error("Error fetching advertisement analytics:", error)
    return NextResponse.json({ error: "Failed to fetch advertisement analytics" }, { status: 500 })
  }
}

