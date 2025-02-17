import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        imageUrl: true,
        imageFile: true,
      }
    })

    const formattedArticles = articles.map(article => ({
      ...article,
      imageFile: article.imageFile ? Buffer.from(article.imageFile).toString('base64') : null,
    }))

    return NextResponse.json({ articles: formattedArticles })
  } catch (error) {
    console.error('Error fetching trending articles:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

