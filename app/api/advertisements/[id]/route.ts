import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { AdPlacement } from "@prisma/client"

// Remove if exists:
// import { AdPlacement } from "@/types/adPlacement"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

  const ad = await prisma.advertisement.findUnique({
    where: { id: params.id }
  })

  if (!ad) {
    return NextResponse.json({ message: "Advertisement not found" }, { status: 404 })
  }

  return NextResponse.json(ad)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const link = formData.get('link') as string
    const placement = formData.get('placement') as AdPlacement
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const imageFile = formData.get('imageFile') as File | null
    const imageLink = formData.get("imageLink") as string | null

    let imageBuffer: Buffer | null = null
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer()
      imageBuffer = Buffer.from(arrayBuffer)
    }

    const updatedAd = await prisma.advertisement.update({
      where: { id: params.id },
      data: {
        link,
        placement,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        image: imageLink ? imageLink : '' ,
        ...(imageBuffer && { imageFile: imageBuffer.toString('base64') }),
        updatedAt: new Date()
      }
    })

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_ADVERTISEMENT',
        details: `Updated advertisement: ${updatedAd.id}`,
        
      }
    })

    return NextResponse.json(updatedAd)
  } catch (error) {
    console.error('Error updating advertisement:', error)
    return NextResponse.json({ message: "An error occurred while updating the advertisement" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

  try {
    await prisma.advertisement.delete({
      where: { id: params.id }
    })

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE_ADVERTISEMENT',
        details: `Deleted advertisement: ${params.id}`
      }
    })

    return NextResponse.json({ message: "Advertisement deleted successfully" })
  } catch (error) {
    console.error('Error deleting advertisement:', error)
    return NextResponse.json({ message: "An error occurred while deleting the advertisement" }, { status: 500 })
  }
}

