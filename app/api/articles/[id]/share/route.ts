import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const article = await prisma.article.update({
      where: { id: params.id },
      data: { shares: { increment: 1 } },
    })

    return NextResponse.json({ shares: article.shares })
  } catch (error) {
    console.error('Error sharing article:', error)
    return NextResponse.json({ error: 'Failed to share article' }, { status: 500 })
  }
}

