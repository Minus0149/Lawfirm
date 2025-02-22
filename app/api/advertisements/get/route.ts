import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const position = searchParams.get("position")
  const location = searchParams.get("location") || null
  const category = searchParams.get("category") || null

  if (!position) {
    return NextResponse.json({ error: "Position is required" }, { status: 400 })
  }

  try {
    const ad = await prisma.advertisement.findFirst({
      where: {
        placement: position as "TOP_BANNER" | "CATEGORY_PAGE",
        location,
        categoryId: category ? category : null,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      }, 
    })

    if (!ad) {
      return NextResponse.json({ error: "No active advertisement found" }, { status: 404 })
    }
    return NextResponse.json(ad)
  } catch (error) {
    console.error("Error fetching advertisement:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

