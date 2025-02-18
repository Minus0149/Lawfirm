import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { uploadFile } from "@/lib/upload"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const skip = (page - 1) * limit

  try {
    const legalDrafts = await prisma.legalDraft.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true },
        },
      },
    })

    const total = await prisma.legalDraft.count()

    return NextResponse.json({
      legalDrafts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching legal drafts:", error)
    return NextResponse.json({ error: "Failed to fetch legal drafts" }, { status: 500 })
  }
}


export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const category = formData.get("category") as string
    const authorId = formData.get("authorId") as string
    const file = formData.get("file") as File | null

    let fileUrl = null
    if (file) {
      fileUrl = await uploadFile(file)
    }

    const legalDraft = await prisma.legalDraft.create({
      data: {
        title,
        content,
        category,
        authorId,
        fileUrl,
      },
    })

    return NextResponse.json(legalDraft, { status: 201 })
  } catch (error) {
    console.error("Error creating legal draft:", error)
    return NextResponse.json({ error: "Failed to create legal draft" }, { status: 500 })
  }
}

