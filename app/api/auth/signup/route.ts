import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json()

  try {
    const emailLowercase = email.toLowerCase()

    const existingUser = await prisma.user.findFirst({
      where: { emailLowercase: emailLowercase }
    })

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)


    const user = await prisma.user.create({
      data: { 
        name, 
        email,
        emailLowercase,
        password: hashedPassword, 
        role: role || 'USER'  // Provide a default role if not specified
      }
    })

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        code: verificationCode,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    })

    await sendVerificationEmail(email, verificationCode)

    return NextResponse.json({ message: "User created. Please verify your email." }, { status: 201 })
  } catch (error) {
    console.error('Error during signup:', error)
    return NextResponse.json({ message: "An error occurred during signup" }, { status: 500 })
  }
}

