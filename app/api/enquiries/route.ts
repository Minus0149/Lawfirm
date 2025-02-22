import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const enquiry = await prisma.enquiry.create({
      data: {
        title: body.title,
        description: body.description,
        name: body.name,
        email: body.email,
        phone: body.phone,
      },
    })
    return NextResponse.json(enquiry, { status: 201 })
  } catch (error) {
    console.error("Error creating enquiry:", error)
    return NextResponse.json({ error: "Failed to create enquiry" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 10
  const status = searchParams.get("status")
  const search = searchParams.get("search")

  const skip = (page - 1) * limit

  const where: {} = {
    ...(status && { status }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  }

  try {
    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.enquiry.count({ where }),
    ])

    return NextResponse.json({
      enquiries,
      total,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching enquiries:", error)
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 })
  }
}

