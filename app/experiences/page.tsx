import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { ExperienceCard } from "@/components/experience-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ExperiencesPage() {
  const session = await getServerSession(authOptions)
  const experiences = await prisma.experience.findMany({
    where: { status: "APPROVED" },
    include: {
      author: {
        select: { name: true,},
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Experiences</h1>
          <Link href="/experiences/new">
            <Button>Share Your Experience</Button>
          </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experiences.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
    </div>
  )
}

