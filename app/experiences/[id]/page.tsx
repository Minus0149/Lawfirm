import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ExperienceCard } from "@/components/experience-card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ExperiencePage({ params }: { params: { id: string } }) {
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

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/experiences" className="flex items-center text-primary hover:underline mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Experiences
      </Link>
      <div className="max-w-2xl mx-auto">
        <ExperienceCard experience={experience} />
      </div>
    </div>
  )
}

