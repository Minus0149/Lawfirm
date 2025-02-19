import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const experience = await prisma.experience.update({
      where: { id: params.id },
      data: { status: "REJECTED" },
    })

    return NextResponse.json(experience)
  } catch (error) {
    console.error("Error rejecting experience:", error)
    return NextResponse.json({ error: "Failed to reject experience" }, { status: 500 })
  }
}

