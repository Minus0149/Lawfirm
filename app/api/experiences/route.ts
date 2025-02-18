import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

//   if (!session || !session.user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

  try {
    const body = await request.json()
    const { name, age, title, company, location, description, startDate, endDate } = body

    const user = await prisma.user.findUnique({
        where: { email: 'user@lexinvictus.com' },
      });

      if (!user) {
        throw new Error('User not found');
      }

    const experience = await prisma.experience.create({
      data: {
        name,
        age: Number.parseInt(age, 10),
        title,
        company,
        location,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        authorId: session?.user.id?? user.id,
      },
    })

    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    console.error("Error creating experience:", error)
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(experiences)
  } catch (error) {
    console.error("Error fetching experiences:", error)
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 })
  }
}

