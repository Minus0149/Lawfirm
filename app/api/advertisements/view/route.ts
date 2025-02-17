import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const { id } = await req.json()

  try {
    const updatedAd = await prisma.advertisement.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json({ views: updatedAd.views })
  } catch (error) {
    console.error('Error updating advertisement views:', error)
    return NextResponse.json({ error: 'Failed to update views' }, { status: 500 })
  }
}

