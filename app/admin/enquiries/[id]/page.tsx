import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteEnquiryButton } from "./delete-button"

export default async function EnquiryPage({ params }: { params: { id: string } }) {
  const enquiry = await prisma.enquiry.findUnique({
    where: { id: params.id },
  })

  if (!enquiry) {
    notFound()
  }

  const statusVariant =
    enquiry.status === "ACTIVE" ? "default" : enquiry.status === "COMPLETE" ? "success" : "destructive"

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin/enquiries">
          <Button variant="outline">← Back to Enquiries</Button>
        </Link>
        <DeleteEnquiryButton id={enquiry.id} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{enquiry.title}</CardTitle>
              <CardDescription>Submitted on {new Date(enquiry.createdAt).toLocaleDateString()}</CardDescription>
            </div>
            <Badge variant={statusVariant}>{enquiry.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-1">
            <h3 className="font-semibold">Contact Information</h3>
            <div className="text-sm text-muted-foreground">
              <p>Name: {enquiry.name}</p>
              <p>Email: {enquiry.email}</p>
              {enquiry.phone && <p>Phone: {enquiry.phone}</p>}
            </div>
          </div>

          <div className="grid gap-1">
            <h3 className="font-semibold">Message</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{enquiry.description}</p>
          </div>

          {enquiry.response && (
            <div className="grid gap-1">
              <h3 className="font-semibold">Response</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{enquiry.response}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(enquiry.updatedAt).toLocaleDateString()}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

