import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { Role } from '@prisma/client'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

  // Filter users based on role
  const where = session.user.role === 'ADMIN' 
    ? { role: { in: [Role.USER, Role.EDITOR] } }
    : {}

  const users = await prisma.user.findMany({
    where,
    select: { id: true, name: true, email: true, role: true, image: true }
  })
  
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as Role
    const imageFile = formData.get('imageFile') as File | null

    if (session.user.role === 'ADMIN' && !['USER', 'EDITOR'].includes(role)) {
      return NextResponse.json({ message: "Admin can only create USER or EDITOR roles" }, { status: 400 })
    }

    const emailLowercase = email.toLowerCase()

    const existingUser = await prisma.user.findFirst({
      where: { emailLowercase: emailLowercase }
    })

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let imageBuffer: Buffer | null = null
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer()
      imageBuffer = Buffer.from(arrayBuffer)
    }

    const user = await prisma.user.create({
      data: { 
        name, 
        email,
        emailLowercase,
        password: hashedPassword, 
        role,
        imageFile: imageBuffer ? imageBuffer.toString('base64') : null,
        emailVerified: new Date(), // Auto-verify users created by admins
      }
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_USER',
        details: `Created user: ${user.email} with role: ${user.role}`
      }
    })

    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { message: "An error occurred while creating the user" },
      { status: 500 }
    )
  }
}

