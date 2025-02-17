import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const { email, verificationCode } = await req.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  const emailLowercase = email.toLowerCase()

  const user = await prisma.user.findUnique({
    where: { emailLowercase: emailLowercase }
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (user.emailVerified) {
    return NextResponse.json({ error: "Email already verified" }, { status: 400 })
  }

  const emailVerification = await prisma.emailVerification.findFirst({
    where: {
      userId: user.id,
      code: verificationCode,
      expiresAt: { gt: new Date() }
    }
  })

  if (!emailVerification) {
    return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() }
  })

  await prisma.emailVerification.delete({
    where: { id: emailVerification.id }
  })

  return NextResponse.json({ message: "Email verified successfully" })
}

