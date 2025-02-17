import { prisma } from "@/lib/prisma"
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const totalViews = await prisma.article.aggregate({
      _sum: {
        views: true
      }
    });
    return NextResponse.json({ totalViews: totalViews._sum.views || 0 });
  } catch (error) {
    console.error("Error fetching total article views:", error);
    return new NextResponse("Error fetching total article views", { status: 500 });
  }
}

