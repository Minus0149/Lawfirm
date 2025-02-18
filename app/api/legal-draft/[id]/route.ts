import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { deleteFile, uploadFile } from "@/lib/upload"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const legalDraft = await prisma.legalDraft.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { name: true },
        },
      },
    })

    if (!legalDraft) {
      return NextResponse.json({ error: "Legal draft not found" }, { status: 404 })
    }

    return NextResponse.json(legalDraft)
  } catch (error) {
    console.error("Error fetching legal draft:", error)
    return NextResponse.json({ error: "Failed to fetch legal draft" }, { status: 500 })
  }
}
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const category = formData.get("category") as string
    const file = formData.get("file") as File | null

    const existingDraft = await prisma.legalDraft.findUnique({
      where: { id: params.id },
      select: { fileUrl: true },
    })

    let fileUrl = existingDraft?.fileUrl

    if (file) {
      // Delete old file if it exists
      if (fileUrl) {
        await deleteFile(fileUrl)
      }
      fileUrl = await uploadFile(file)
    }

    const legalDraft = await prisma.legalDraft.update({
      where: { id: params.id },
      data: {
        title,
        content,
        category,
        fileUrl,
      },
    })

    return NextResponse.json(legalDraft)
  } catch (error) {
    console.error("Error updating legal draft:", error)
    return NextResponse.json({ error: "Failed to update legal draft" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const draft = await prisma.legalDraft.findUnique({
      where: { id: params.id },
      select: { fileUrl: true },
    })

    if (draft?.fileUrl) {
      await deleteFile(draft.fileUrl)
    }

    await prisma.legalDraft.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Legal draft deleted successfully" })
  } catch (error) {
    console.error("Error deleting legal draft:", error)
    return NextResponse.json({ error: "Failed to delete legal draft" }, { status: 500 })
  }
}
