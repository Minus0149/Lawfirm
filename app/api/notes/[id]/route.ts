import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { deleteFile, uploadFile } from "@/lib/upload"

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
    const formData = await request.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const category = formData.get("category") as string
    const file = formData.get("file") as File | null

    const existingNote = await prisma.note.findUnique({
      where: { id: params.id },
      select: { fileUrl: true },
    })

    let fileUrl = existingNote?.fileUrl

    if (file) {
      // Delete old file if it exists
      if (fileUrl) {
        await deleteFile(fileUrl)
      }
      fileUrl = await uploadFile(file)
    }

    const note = await prisma.note.update({
      where: { id: params.id },
      data: {
        title,
        content,
        category: { connect: { id: category } },
        fileUrl,
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error("Error updating note:", error)
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
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

    return NextResponse.json({ message: "Note deleted successfully" })
  } catch (error) {
    console.error("Error deleting note:", error)
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
  }
}

