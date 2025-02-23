import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { uploadFile } from "@/lib/upload"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const skip = (page - 1) * limit

  try {
    const notes = await prisma.note.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true },
        },
      },
    })

    const total = await prisma.note.count()

    return NextResponse.json({
      notes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const categoryId = formData.get("categoryId") as string
    const description = formData.get("description") as string
    const file = formData.get("file") as File | null

    let fileUrl: string | null = null
    if (file && file.size > 0) {
      try {
        fileUrl = await uploadFile(file)
      } catch (error) {
        console.error("Error uploading file:", error)
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
      }
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        category: { connect: { id: categoryId } },
        author: { connect: { id: session.user.id } }, // Connect author by id
        fileUrl: fileUrl || "",
        description
      },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }
}

