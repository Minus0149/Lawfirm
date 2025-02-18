import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/formatDate"

interface ExperienceCardProps {
  experience: {
    id: string
    name: string
    age: number
    title: string
    company: string
    location: string
    description: string
    startDate: Date
    endDate: Date | null
    author: {
      name: string
    }
  }
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{experience.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold mb-2">{experience.name}</p>
        <p className="text-muted-foreground mb-2">
          {experience.company} - {experience.location}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : "Present"}
        </p>
        <p className="mb-4">{experience.description}</p>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Age: {experience.age}</span>
          <span>Shared by {experience.author.name}</span>
        </div>
      </CardContent>
    </Card>
  )
}

