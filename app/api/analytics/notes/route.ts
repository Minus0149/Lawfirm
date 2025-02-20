import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Note {
    id: string;
    title: string;
    content: string;
    downloads: number;
    createdAt: Date;
    category: {
        name: string;
    };
    author: {
        name: string;
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const category = searchParams.get("category") === "all" ? "" : searchParams.get("category");

    const skip = (page - 1) * limit;

    const dateFilter = {
        ...(startDate && endDate
            ? {
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                }
            : {}),
    };

    const categoryFilter = {
        ...(category
            ? {
                    category: {
                        name: category,
                    },
                }
            : {}),
    };

    try {
        const [notes, totalNotes, downloadTrends, categoryPerformance] = await Promise.all([
            prisma.note.findMany({
                where: {
                    ...dateFilter,
                    ...categoryFilter,
                },
                include: {
                    category: {
                        select: { name: true },
                    },
                    author: {
                        select: { name: true },
                    },
                },
                orderBy: { downloads: "desc" },
                skip,
                take: limit,
            }),
            prisma.note.count({
                where: {
                    ...dateFilter,
                    ...categoryFilter,
                },
            }),
            prisma.note.groupBy({
                by: ["createdAt"],
                where: {
                    ...dateFilter,
                },
                _sum: {
                    downloads: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            }),
            prisma.note.groupBy({
                by: ["categoryId"],
                where: dateFilter,
                _sum: {
                    downloads: true,
                },
                orderBy: {
                    _sum: {
                        downloads: "desc",
                    },
                },
                take: 5,
            }),
        ]);

        const totalDownloads: number = notes.reduce((sum: number, note: Note) => sum + note.downloads, 0);
        const averageDownloads = totalDownloads / (notes.length || 1);

        const popularCategory = await prisma.category.findFirst({
            where: { id: categoryPerformance[0]?.categoryId },
            select: { name: true },
        });

        return NextResponse.json({
            notes,
            totalNotes,
            totalDownloads,
            averageDownloads,
            popularCategory: popularCategory?.name || "N/A",
            downloadTrends,
            categoryPerformance: await Promise.all(
                categoryPerformance.map(async (cp) => {
                    const category = await prisma.category.findUnique({
                        where: { id: cp.categoryId },
                        select: { name: true },
                    });
                    return {
                        category: category?.name || "Unknown",
                        downloads: cp._sum.downloads || 0,
                    };
                })
            ),
            newNotes: await prisma.note.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    },
                },
            }),
            downloadGrowth: 0, // Calculate based on previous month's data
        });
    } catch (error) {
        console.error("Error fetching notes analytics:", error);
        return NextResponse.json({ error: "Failed to fetch notes analytics" }, { status: 500 });
    }
}
