import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const pendingArticles = await prisma.article.findMany({
    where: { status: 'PENDING' },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      title: true,
      author: { select: { name: true } },
      category: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  })

  const totalArticles = await prisma.article.count({
    where: { status: 'PENDING' }
  })

  return NextResponse.json({
    articles: pendingArticles,
    totalArticles,
  })
}

