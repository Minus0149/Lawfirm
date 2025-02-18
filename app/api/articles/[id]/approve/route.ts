import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

  const { approved, comment } = await req.json()

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const article = await prisma.article.findUnique({ where: { id: params.id } })

    const updatedArticle = await prisma.article.update({
      where: { id: params.id },
      data: { 
      status: approved ? 'PUBLISHED' : 'REJECTED',
      approvalComments: comment,
      ...(article?.authorId ? {} : { author: { connect: { id: user.id } } })
      }
    })

    await prisma.activityLog.create({
      data: {
        action: approved ? 'APPROVE_ARTICLE' : 'REJECT_ARTICLE',
        details: `${approved ? 'Approved' : 'Rejected'} article: ${params.id}. Comment: ${comment}`,
        userId: user.id
      }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error approving/rejecting article:', error)
    return NextResponse.json({ message: "An error occurred while approving/rejecting the article" }, { status: 500 })
  }
}

