import { prisma } from "@/lib/prisma"
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const count = await prisma.user.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching user count:", error);
    return new NextResponse("Error fetching user count", { status: 500 });
  }
}

