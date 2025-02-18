import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { deleteFile, uploadFile } from "@/lib/upload"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"  

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const note = await prisma.note.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { name: true },
        },
      },
    })

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error("Error fetching note:", error)
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const categoryId = formData.get("categoryId") as string
    const description = formData.get("description") as string
    const file = formData.get("file") as File | null

    

    const existingNote = await prisma.note.findUnique({
      where: { id: params.id },
      select: { fileUrl: true },
    })

    let fileUrl = existingNote?.fileUrl
    if (file) {
      // Delete old file if it exists and the new file is not an empty string
      if (file.size > 0) {
      if (fileUrl) {
        await deleteFile(fileUrl)
      }
      fileUrl = await uploadFile(file)
      } else {
      fileUrl = existingNote?.fileUrl
      }
    }

    const note = await prisma.note.update({
      where: { id: params.id },
      data: {
        title,
        content,
        categoryId,
        fileUrl,
        description
      },
    })

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE_NOTE',
        details: `Updated note: ${params.id}`,
        userId: session.user.id
      }
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error("Error updating note:", error)
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    const note = await prisma.note.findUnique({
      where: { id: params.id },
      select: { fileUrl: true },
    })

    if (note?.fileUrl) {
      await deleteFile(note.fileUrl)
    }

    await prisma.note.delete({
      where: { id: params.id },
    })

    await prisma.activityLog.create({
      data: {
        action: 'DELETE_NOTE',
        details: `Deleted note: ${params.id}`,
        userId: session.user.id
      }
    })

    return NextResponse.json({ message: "Note deleted successfully" })
  } catch (error) {
    console.error("Error deleting note:", error)
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
  }
}