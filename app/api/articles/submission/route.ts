import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { imageToBuffer, urlToBuffer } from "@/lib/imageUtils";

export async function POST(req: NextRequest) {

    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const imageFile = formData.get('imageFile') as File | null;
        const imageLink = formData.get('imageLink') as string | null;

        let imageBuffer: Buffer | null = null;
        if (imageFile instanceof File) {
            imageBuffer = await imageToBuffer(imageFile);
        } else if (imageLink && typeof imageLink === 'string') {
            imageBuffer = await urlToBuffer(imageLink);
        }

        const userSubmittedCategory = await prisma.category.findFirst({
            where: { name: "User Submitted" },
          })
      
          if (!userSubmittedCategory) {
            // Create the "User Submitted" category if it doesn't exist
            await prisma.category.create({
              data: {
                name: "User Submitted",
                slug: "user-submitted",
              },
            })
          }
      
          const article = await prisma.article.create({
            data: {
              title,
              content,
              imageFile: imageBuffer ? imageBuffer.toString('base64') : null,
              status: "PENDING",
              category: { connect: { slug: "user-submitted" } },
            },
          })
      
          const user = await prisma.user.findUnique({
            where: { email: 'user@lexinvictus.com' },
          });

          if (!user) {
            throw new Error('User not found');
          }

          await prisma.activityLog.create({
            data: {
                action: 'CREATE_ARTICLE',
                details: `Created article: ${article.id} (Pending Approval)`,
                userId: user.id,
            }
          });

        return NextResponse.json(article);
    } catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json({ message: "An error occurred while creating the article" }, { status: 500 });
    }
}
