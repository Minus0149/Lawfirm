import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const { id } = await req.json()

  try {
    const updatedAd = await prisma.advertisement.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    })

    return NextResponse.json({ clicks: updatedAd.clicks })
  } catch (error) {
    console.error('Error updating advertisement clicks:', error)
    return NextResponse.json({ error: 'Failed to update clicks' }, { status: 500 })
  }
}

