import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import crypto from 'crypto'
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'USER';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
 const session = await getServerSession(authOptions)

 if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
   return NextResponse.json({ message: "Not authorized" }, { status: 403 })
 }

 const user = await prisma.user.findUnique({
   where: { id: params.id },
   select: { id: true, name: true, email: true, role: true, imageFile: true }
 })

 if (!user) {
   return NextResponse.json({ message: "User not found" }, { status: 404 })
 }

 return NextResponse.json(user)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
 const session = await getServerSession(authOptions)

 if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
   return NextResponse.json({ message: "Not authorized" }, { status: 403 })
 }

 try {
   const formData = await req.formData()
   const name = formData.get('name') as string
   const email = formData.get('email') as string
   const role = formData.get('role') as Role
   const imageFile = formData.get('imageFile') as File | null

   let imageBuffer: Buffer | null = null
   if (imageFile) {
     const arrayBuffer = await imageFile.arrayBuffer()
     imageBuffer = Buffer.from(arrayBuffer)
   }

   const updatedUser = await prisma.user.update({
     where: { id: params.id },
     data: { 
       name, 
       email, 
       role,
       ...(imageBuffer && { imageFile: imageBuffer.toString('base64') }),
     }
   })

   await prisma.activityLog.create({
     data: {
       action: 'UPDATE_USER',
       details: `Updated user: ${updatedUser.email}`,
       userId: session.user.id
     }
   })

   return NextResponse.json(
     { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role }
   )
 } catch (error) {
   console.error('Error updating user:', error)
   return NextResponse.json({ message: "An error occurred while updating the user" }, { status: 500 })
 }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
 const session = await getServerSession(authOptions)

 if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
   return NextResponse.json({ message: "Not authorized" }, { status: 403 })
 }

 try {
   const userToDelete = await prisma.user.findUnique({
     where: { id: params.id },
     select: { id: true, email: true }
   })

   if (!userToDelete) {
     return NextResponse.json({ message: "User not found" }, { status: 404 })
   }

   // Create a new user for deleted user's content with a UUID
   const deletedUser = await prisma.user.create({
     data: {
       id: uuidv4(), // Generate a UUID for the id
       name: 'Deleted User',
       email: `deleted-${Date.now()}-${userToDelete.email}`,
       emailLowercase: `deleted-${Date.now()}-${userToDelete.email.toLowerCase()}`,
       role: 'USER',
       password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10), // Random, unguessable password
     }
   })

   // Transfer all articles to the new deleted user
   await prisma.article.updateMany({
     where: { authorId: params.id },
     data: { authorId: deletedUser.id }
   })

   // Now we can safely delete the original user
   const deletedOriginalUser = await prisma.user.delete({
     where: { id: params.id }
   })

   await prisma.activityLog.create({
     data: {
       userId: session.user.id,
       action: 'DELETE_USER',
       details: `Deleted user: ${deletedOriginalUser.email}, content transferred to ${deletedUser.id}`
     }
   })

   return NextResponse.json({ message: "User deleted successfully and content transferred" })
 } catch (error) {
   console.error('Error deleting user:', error)
   return NextResponse.json({ message: "An error occurred while deleting the user" }, { status: 500 })
 }
}

