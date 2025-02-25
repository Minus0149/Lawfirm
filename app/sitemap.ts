import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lexinvictus.vercel.app"

  // Fetch all dynamic content
  const [articles, categories, notes, experiences] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, updatedAt: true },
    }),
    prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    }),
    prisma.note.findMany({
      select: { id: true, updatedAt: true },
    }),
    prisma.experience.findMany({
      where: { status: "APPROVED" },
      select: { id: true, updatedAt: true },
    }),
  ])

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mentors`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ]

  // Dynamic routes
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/article/${article.id}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const noteRoutes = notes.map((note) => ({
    url: `${baseUrl}/notes/${note.id}`,
    lastModified: note.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  const experienceRoutes = experiences.map((experience) => ({
    url: `${baseUrl}/experiences/${experience.id}`,
    lastModified: experience.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes, ...noteRoutes, ...experienceRoutes]
}

