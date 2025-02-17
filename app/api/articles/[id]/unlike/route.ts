import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const article = await prisma.article.update({
      where: { id: params.id },
      data: { likes: { decrement: 1 } },
    })

    return NextResponse.json({ likes: article.likes })
  } catch (error) {
    console.error('Error unliking article:', error)
    return NextResponse.json({ error: 'Failed to unlike article' }, { status: 500 })
  }
}

