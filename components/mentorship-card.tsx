import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export function MentorshipSection() {
  return (
    <section className="pt-16 rounded-none">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Legal Mentors</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with experienced legal professionals who can guide you through your journey in the legal field.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {siteConfig.mentors.map((mentor) => (
            <div key={mentor.name} className="flex flex-col items-center">
              {/* Mentor Image */}
              <div className="aspect-[3/4] relative">
                <img
                  src={mentor.photo || "/placeholder.svg"}
                  alt={mentor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Section */}
              <Card className="-top-16 left-0 w-11/12 shadow-lg text-center relative rounded-none border-0">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                <CardHeader className="p-0 pt-4 space-y-0.5">
                  <CardTitle className="text-2xl font-bold">{mentor.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{mentor.role}</p>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-center text-muted-foreground text-sm">{mentor.description}</p>
                </CardContent>
                <CardFooter className="justify-center pb-5 pt-1">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full">
                    <a href={mentor.website} target="_blank" rel="noopener noreferrer">
                      Book a session now
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
