import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: params.id },
    })

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    return NextResponse.json(enquiry)
  } catch (error) {
    console.error("Error fetching enquiry:", error)
    return NextResponse.json({ error: "Failed to fetch enquiry" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const enquiry = await prisma.enquiry.update({
      where: { id: params.id },
      data: body,
    })
    return NextResponse.json(enquiry)
  } catch (error) {
    console.error("Error updating enquiry:", error)
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.enquiry.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ message: "Enquiry deleted successfully" })
  } catch (error) {
    console.error("Error deleting enquiry:", error)
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 })
  }
}

