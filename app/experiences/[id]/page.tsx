import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/formatDate"

interface ExperiencePageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: ExperiencePageProps): Promise<Metadata> {
  const experience = await prisma.experience.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: { name: true },
      },
    },
  })

  if (!experience) {
    return {}
  }

  return {
    title: `${experience.title} at ${experience.company}`,
    description: experience.description?.substring(0, 160),
    authors: [{ name: experience.author?.name || "Unknown" }],
    openGraph: {
      title: `${experience.title} at ${experience.company}`,
      description: experience.description?.substring(0, 160),
      type: "article",
      publishedTime: experience.createdAt.toISOString(),
      modifiedTime: experience.updatedAt.toISOString(),
      authors: [experience.author?.name || "Unknown"],
    },
  }
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const experience = await prisma.experience.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: { name: true },
      },
    },
  })

  if (!experience) {
    notFound()
  }

  // Add structured data for Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${experience.title} at ${experience.company}`,
    description: experience.description,
    author: {
      "@type": "Person",
      name: experience.author?.name || "Unknown",
    },
    datePublished: experience.createdAt.toISOString(),
    dateModified: experience.updatedAt.toISOString(),
    publisher: {
      "@type": "Organization",
      name: "LexInvictus",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
      },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{experience.title}</CardTitle>
            <div className="text-lg font-semibold text-primary dark:text-blue-500">{experience.company}</div>
            <div className="text-sm text-muted-foreground">
              {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : "Present"}
            </div>
            <div className="text-sm text-muted-foreground">Shared by {experience.author?.name || "Unknown"}</div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p>{experience.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

