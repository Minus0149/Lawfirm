import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { name: true },
        },
      },
    })

    if (!experience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }

    return NextResponse.json(experience)
  } catch (error) {
    console.error("Error fetching experience:", error)
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

  try {
    const body = await request.json()
    const { title, company, description, startDate, endDate } = body

    const experience = await prisma.experience.update({
      where: { id: params.id },
      data: {
        title,
        company,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    })

    return NextResponse.json(experience)
  } catch (error) {
    console.error("Error updating experience:", error)
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

  try {
    await prisma.experience.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Experience deleted successfully" })
  } catch (error) {
    console.error("Error deleting experience:", error)
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 })
  }
}

