import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { siteConfig } from "@/config/site"
import { ExternalLink } from "lucide-react"

export function MentorshipCards() {
  return (
    <section className="py-12 bg-muted/30" >
      <div className="container mx-auto px-4" id="mentorship">
        <h2 className="text-3xl font-bold text-center mb-8">Our Legal Mentors</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {siteConfig.mentors.map((mentor) => (
            <Card key={mentor.name} className="flex flex-col">
              <CardHeader>
                <div className="relative w-full h-64 mb-4">
                  <Image
                  src={mentor.photo || "/placeholder.svg"}
                  alt={mentor.name}
                  fill
                  className="rounded-lg w-full h-full object-scale-down"
                  />
                </div>
                <CardTitle>{mentor.name}</CardTitle>
                <CardDescription>{mentor.role}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{mentor.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a
                    href={mentor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    Book a Session
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

