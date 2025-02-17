import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { Category, Status, Role } from "@prisma/client"
import { imageToBuffer, urlToBuffer } from '@/lib/imageUtils'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const category = searchParams.get('category') as Category | undefined | 'all_categories'
  const status = searchParams.get('status') as Status | undefined | 'all_statuses'
  const role = searchParams.get('role') as Role | undefined | 'all_roles'
  const userId = searchParams.get('userId')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const dateType = searchParams.get('dateType') || 'created'

  const where: any = {}
  if (category && category !== 'all_categories') where.category = category
  if (status && status !== 'all_statuses') where.status = status
  if (userId && userId !== 'all_users') where.authorId = userId
  if (role && role !== 'all_roles') where.author = { role: role }
  if (startDate || endDate) {
    where[dateType === 'updated' ? 'updatedAt' : 'createdAt'] = {}
    if (startDate) where[dateType === 'updated' ? 'updatedAt' : 'createdAt'].gte = new Date(startDate)
    if (endDate) {
      const endDateObj = new Date(endDate)
      endDateObj.setHours(23, 59, 59, 999) // Set to end of day
      where[dateType === 'updated' ? 'updatedAt' : 'createdAt'].lte = endDateObj
    }
  }

  try {
    const [articles, totalArticles] = await Promise.all([
      prisma.article.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true, role: true } } }
      }),
      prisma.article.count({ where })
    ])

    return NextResponse.json({
      articles,
      page,
      limit,
      totalArticles,
      totalPages: Math.ceil(totalArticles / limit)
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ message: "An error occurred while fetching articles" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.user.role)) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const imageFile = formData.get('imageFile') as File | null
    const imageLink = formData.get('imageLink') as string | null

    let imageBuffer: Buffer | null = null;
    if (imageFile instanceof File) {
      imageBuffer = await imageToBuffer(imageFile);
    } else if (imageLink && typeof imageLink === 'string') {
      imageBuffer = await urlToBuffer(imageLink);
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        category: { connect: { id: category } },
        imageFile: imageBuffer ? imageBuffer.toString('base64') : null,
        author: { connect: { id: session.user.id } },
        status: 'PENDING'
      }
    })

    await prisma.activityLog.create({
      data: {
        action: 'CREATE_ARTICLE',
        details: `Created article: ${article.id} (Pending Approval)`,
        userId: session.user.id
      }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json({ message: "An error occurred while creating the article" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.user.role)) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const categoryId = formData.get('category') as string
    const imageFile = formData.get('imageFile') as File | null
    const imageLink = formData.get('imageLink') as string | null

    let imageBuffer: Buffer | null = null;
    if (imageFile instanceof File) {
      imageBuffer = await imageToBuffer(imageFile);
    } else if (imageLink && typeof imageLink === 'string') {
      imageBuffer = await urlToBuffer(imageLink);
    }

    const article = await prisma.article.update({
      where: { id },
      data: { 
        title, 
        content, 
        category: { connect: { id: categoryId } },
        imageFile: imageBuffer ? imageBuffer.toString('base64') : null,
        status: 'PENDING'
      }
    })

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE_ARTICLE',
        details: `Updated article: ${article.id} (Pending Approval)`,
        userId: session.user.id
      }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json({ message: "An error occurred while updating the article" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
 const session = await getServerSession(authOptions)

 if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
   return NextResponse.json({ message: "Not authorized" }, { status: 403 })
 }

 try {
   const { id } = await req.json()

   // Check if the article exists
   const article = await prisma.article.findUnique({
     where: { id }
   })

   if (!article) {
     return NextResponse.json({ message: "Article not found" }, { status: 404 })
   }

   // Delete the article
   const deletedArticle = await prisma.article.delete({
     where: { id }
   })

   // Log the activity
   await prisma.activityLog.create({
     data: {
       action: 'DELETE_ARTICLE',
       details: `Deleted article: ${deletedArticle.title} (ID: ${deletedArticle.id})`,
       userId: session.user.id
     }
   })

   return NextResponse.json({ 
     message: "Article deleted successfully", 
     id: deletedArticle.id,
     title: deletedArticle.title
   })
 } catch (error) {
   console.error('Error deleting article:', error)
   if (error instanceof Error) {
    console.error('Error deleting article:', error.message);
    if (error.message.includes('P2025')) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }
  }
   return NextResponse.json({ message: "An error occurred while deleting the article" }, { status: 500 })
 }
}

