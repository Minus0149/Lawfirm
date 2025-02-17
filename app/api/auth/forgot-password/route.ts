import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import crypto from 'crypto'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry }
  })

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    text: `Please use the following link to reset your password: ${resetUrl}`,
    html: `<p>Please use the following link to reset your password:</p>
<p style="text-align: center;">
  <a href="${resetUrl}" 
     style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; 
     padding: 10px 20px; border-radius: 5px; font-size: 16px;">
     Reset Your Password
  </a>
</p>
<p>If the button doesn't work, you can also copy and paste the following URL into your browser:</p>
<p style="background: #f9f9f9; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
  ${resetUrl}
</p>
<p>If you did not request a password reset, please ignore this message.</p>
`
  })

  return NextResponse.json({ message: "Password reset email sent" })
}

