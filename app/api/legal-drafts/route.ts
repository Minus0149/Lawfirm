import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { uploadFile } from "@/lib/upload"
import { connect } from "http2"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

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
  const session = await getServerSession(authOptions)
  // if (!session) {
  //   return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  // }
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

    

    const user = await prisma.user.findUnique({
      where: { email: 'user@lexinvictus.com' },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const legalDraft = await prisma.legalDraft.create({
      data: {
        title,
        content,
        category,
        authorId: session?.user.id? session.user.id : user.id,
        fileUrl,
      },
    })

    await prisma.activityLog.create({
      data: {
      action: 'CREATE_LEGAL_DRAFT',
      details: `Created legal draft: ${legalDraft.id}`,
      userId: user.id,
      },
    })

    return NextResponse.json(legalDraft, { status: 201 })
  } catch (error) {
    console.error("Error creating legal draft:", error)
    return NextResponse.json({ error: "Failed to create legal draft" }, { status: 500 })
  }
}

