import { EnquiryForm } from "@/components/enquiry-form"

export default function EnquiryPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Submit an Enquiry</h1>
        <p className="text-muted-foreground mb-8">
          Please fill out the form below and we will get back to you as soon as possible.
        </p>
        <EnquiryForm />
      </div>
    </div>
  )
}

