import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { Article } from '@/types/article'
import { Advertisement } from '@/types/advertisement'
import { url } from 'inspector'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

  try {
    const [articleData, advertisementData, totalArticlesData, totalUsersData, totalAdsData, totalViewsData] = await Promise.all([
      prisma.article.findMany({
        include: { author: { select: { id:true,name: true, role: true } }, category: true },
        orderBy: { views: 'desc' }
      }),
      prisma.advertisement.findMany({
        orderBy: { views: 'desc' }
      }),
      prisma.article.count(),
      prisma.user.count(),
      prisma.advertisement.count(),
      prisma.article.aggregate({
        _sum: {
          views: true
        }
      })
    ])

    const analyticsData = {
      articles: articleData as Article[],
      advertisements: advertisementData.map(ad => ({
        ...ad,
        imageFile: ad.imageFile ? Buffer.from(ad.imageFile) : undefined
      })) as Advertisement[],
      totalArticles: totalArticlesData,
      totalUsers: totalUsersData,
      totalAds: totalAdsData,
      totalViews: totalViewsData._sum.views || 0,
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 })
  }
}