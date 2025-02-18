import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { deleteFile, uploadFile } from "@/lib/upload"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

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
  
  const session = await getServerSession(authOptions)
    if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }
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
      // Delete old file if it exists and the new file is not an empty string
      if (file.size > 0) {
      if (fileUrl) {
        await deleteFile(fileUrl)
      }
      fileUrl = await uploadFile(file)
      } else {
      fileUrl = existingDraft?.fileUrl
      }
    }

    const legalDraft = await prisma.legalDraft.findUnique({
      where: { id: params.id },
    })

    const updatedLegalDraft = await prisma.legalDraft.update({
      where: { id: params.id },
      data: {
        title,
        content,
        category,
        fileUrl,
        ...(legalDraft?.authorId ? {} : { author: { connect: { id: session.user.id } } })
      },
    })

    // Log the update action
    await prisma.activityLog.create({
      data: {
        action: 'UPDATE_LEGAL_DRAFT',
        details: `Updated legal draft: ${params.id}`,
        userId:  session.user.id
      }
    })

    return NextResponse.json(updatedLegalDraft)
  } catch (error) {
    console.error("Error updating legal draft:", error)
    return NextResponse.json({ error: "Failed to update legal draft" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
    if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

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

    // Log the delete action
    await prisma.activityLog.create({
      data: {
        action: 'DELETE_LEGAL_DRAFT',
        details: `Deleted legal draft: ${params.id}`,
        userId:  session.user.id 
      }
    })

    return NextResponse.json({ message: "Legal draft deleted successfully" })
  } catch (error) {
    console.error("Error deleting legal draft:", error)
    return NextResponse.json({ error: "Failed to delete legal draft" }, { status: 500 })
  }
}