import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const content = formData.get("content") as string
    const file = formData.get("file") as File | null

    let fileUrl = null
    if (file) {
      // Handle file upload here (e.g., to a cloud storage service)
      // For this example, we'll just use a placeholder URL
      fileUrl = "https://example.com/uploads/" + file.name
    }

    const legalDraft = await prisma.legalDraft.create({
      data: {
        title,
        category,
        content,
        fileUrl,
        author: { connect: { id: session.user.id } },
      },
    })

    return NextResponse.json(legalDraft, { status: 201 })
  } catch (error) {
    console.error("Error submitting legal draft:", error)
    return NextResponse.json({ error: "Failed to submit legal draft" }, { status: 500 })
  }
}

