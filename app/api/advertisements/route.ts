import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { AdPlacement } from "@prisma/client"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const placement = searchParams.get('placement') as AdPlacement | null
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const location = searchParams.get("location") || undefined
  const category = searchParams.get("category") || undefined

  const where: any = {}
  if (placement) where.placement = placement
  if (startDate) where.startDate = { gte: new Date(startDate) }
  if (endDate) where.endDate = { lte: new Date(endDate) }
  if (location) where.location = location
  if (category) where.category = category

  const [ads, total] = await Promise.all([
    prisma.advertisement.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.advertisement.count({ where })
  ])

  return NextResponse.json({
    ads,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const link = formData.get('link') as string
    const placement = formData.get('placement') as AdPlacement
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const imageFile = formData.get('imageFile') as File | null
    const location = formData.get("location") as string
    const category = formData.get("category") as string

    let imageBuffer: Buffer | null = null
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer()
      imageBuffer = Buffer.from(arrayBuffer)
    }

    const ad = await prisma.advertisement.create({
      data: {
        link,
        placement,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        imageFile: imageBuffer ? imageBuffer.toString('base64') : null,
        location,
        categoryId: category
      }
    })

    await prisma.activityLog.create({
      data: {
        action: 'CREATE_ADVERTISEMENT',
        details: `Created advertisement: ${ad.id}`,
        userId: session.user.id
      }
    })

    return NextResponse.json(ad, { status: 201 })
  } catch (error) {
    console.error('Error creating advertisement:', error)
    return NextResponse.json({ message: "An error occurred while creating the advertisement" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const id = formData.get('id') as string
    const link = formData.get('link') as string
    const placement = formData.get('placement') as AdPlacement
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const imageFile = formData.get('imageFile') as File | null

    let imageBuffer: Buffer | null = null
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer()
      imageBuffer = Buffer.from(arrayBuffer)
    }

    const updatedAd = await prisma.advertisement.update({
      where: { id },
      data: {
        link,
        placement,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        ...(imageBuffer && { imageFile: imageBuffer.toString('base64') }),
      }
    })

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE_ADVERTISEMENT',
        details: `Updated advertisement: ${updatedAd.id}`,
        userId: session.user.id
      }
    })

    return NextResponse.json(updatedAd)
  } catch (error) {
    console.error('Error updating advertisement:', error)
    return NextResponse.json({ message: "An error occurred while updating the advertisement" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

  try {
    const { id } = await req.json()

    const deletedAd = await prisma.advertisement.delete({
      where: { id }
    })

    await prisma.activityLog.create({
      data: {
        action: 'DELETE_ADVERTISEMENT',
        details: `Deleted advertisement: ${id}`,
        userId: session.user.id
      }
    })

    return NextResponse.json({ message: "Advertisement deleted successfully", id: deletedAd.id })
  } catch (error) {
    console.error('Error deleting advertisement:', error)
    return NextResponse.json({ message: "An error occurred while deleting the advertisement" }, { status: 500 })
  }
}

