import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/formatDate"
import ExperienceActions from "@/components/approve-reject-button"

export default async function AdminExperienceViewPage({ params }: { params: { id: string } }) {
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
      <h1 className="text-3xl font-bold mb-6">{experience.title}</h1>
      <div className="mb-4">
        <p className="text-muted-foreground">
          By {experience.author?.name || "Unknown"} | Company: {experience.company}
        </p>
        <p className="text-muted-foreground">
          {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : "Present"}
        </p>
        <p className="text-muted-foreground">Status: {experience.status}</p>
        <p className="text-muted-foreground">Created: {formatDate(experience.createdAt)}</p>
      </div>
      <div className="prose max-w-none mb-6">{experience.description}</div>
      <div className="flex space-x-4">
        <Link href={`/admin/experiences/${experience.id}/edit`}>
          <Button>Edit</Button>
        </Link>
        {experience.status === "PENDING" && (
          <ExperienceActions experienceId={experience.id}></ExperienceActions>
        )}
      </div>
    </div>
  )
}

