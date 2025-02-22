import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MessageCircle, BookOpen, Award } from "lucide-react"
import Link from "next/link"
import { siteConfig } from "@/config/site"

export default function CommunityPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Join Our Legal Community</h1>
          <p className="text-xl text-muted-foreground">
            Connect with fellow legal professionals, share knowledge, and grow together
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Network
              </CardTitle>
              <CardDescription>Connect with legal professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Build meaningful connections with lawyers, law students, and legal experts from around the world.
              </p>
              <Link href={siteConfig.communityLinks.network} className="flex items-center space-x-2">
                <Button className="w-full">Join Network</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Discussions
              </CardTitle>
              <CardDescription>Engage in legal discussions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Participate in thought-provoking discussions about legal cases, developments, and challenges.
              </p>
              <Link href={siteConfig.communityLinks.discussions} className="flex items-center space-x-2">
                <Button className="w-full">Join Discussions</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Resources
              </CardTitle>
              <CardDescription>Access exclusive resources</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Get access to premium legal resources, templates, and educational materials.</p>
              <Link href={siteConfig.communityLinks.resources} className="flex items-center space-x-2">
                <Button className="w-full">Browse Resources</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Mentorship
              </CardTitle>
              <CardDescription>Learn from experts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Connect with experienced mentors who can guide you through your legal career.</p>
              <Link href={siteConfig.communityLinks.mentorship} className="flex items-center space-x-2">
                <Button className="w-full" >Find Mentor</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

