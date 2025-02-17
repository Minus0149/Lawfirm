import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const articleId = params.id
  const cookieStore = cookies()
  const viewedArticles = JSON.parse(cookieStore.get('viewedArticles')?.value || '[]')

  if (!viewedArticles.includes(articleId)) {
    try {
      // Increment views in database
      const article = await prisma.article.update({
        where: { id: articleId },
        data: { views: { increment: 1 } },
      })

      // Update cookie
      viewedArticles.push(articleId)
      const response = NextResponse.json({ views: article.views })
      response.cookies.set('viewedArticles', JSON.stringify(viewedArticles), {
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      })

      return response
    } catch (error) {
      console.error('Error updating article views:', error)
      return NextResponse.json({ error: 'Failed to update views' }, { status: 500 })
    }
  }

  return NextResponse.json({ message: 'Article already viewed' })
}

