import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { writeFile } from 'fs/promises'
import path from 'path'
import { Category } from "@/types/category"
import { imageToBuffer, urlToBuffer } from "@/lib/imageUtils"; // Assuming these functions are defined elsewhere

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const article = await prisma.article.findUnique({
    where: { id },
    include: { author: true, category: true }
  })

  if (!article) {
    return NextResponse.json({ message: "Article not found" }, { status: 404 })
  }

  return NextResponse.json(article)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.user.role)) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const categoryId = formData.get('categoryId') as string
    const imageFile = formData.get('imageFile') as File | null
    const imageLink = formData.get('imageLink') as string | null

    let imageBuffer: Buffer | null = null;
    if (imageFile instanceof File) {
      imageBuffer = await imageToBuffer(imageFile);
    } else if (imageLink && typeof imageLink === 'string') {
      imageBuffer = await urlToBuffer(imageLink);
    }

    const article = await prisma.article.update({
      where: { id: params.id },
      data: { 
        title, 
        content, 
        categoryId,
        imageUrl: imageLink ? imageLink : '',
        imageFile: imageBuffer ? imageBuffer.toString('base64') : null,
        status: 'PENDING'  // Set all edited articles to PENDING
      }
    })

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_ARTICLE',
        details: `Updated article: ${article.id} (Pending Approval)`
      }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json({ message: "An error occurred while updating the article" }, { status: 500 })
  }
}

