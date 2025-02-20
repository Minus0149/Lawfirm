import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MessageCircle, BookOpen, Award } from "lucide-react"
import Link from "next/link"

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
              <Button className="w-full">Join Network</Button>
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
              <Button className="w-full">Join Discussions</Button>
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
              <Button className="w-full">Browse Resources</Button>
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
              <Button className="w-full">Find Mentor</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Ready to Join?</h2>
              <p>Join our community today and take advantage of all the benefits we offer to legal professionals.</p>
              <Link href="/signup">
                <Button variant="secondary" size="lg">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

