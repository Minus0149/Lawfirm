import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">About TheHit.in</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <p>
            Welcome to TheHit.in, your trusted source for the latest news and updates. Founded in 2023, we are committed to delivering accurate, timely, and engaging content to our readers across the globe.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4">Our Mission</h2>
          <p>
            At TheHit.in, our mission is to inform, educate, and empower our readers with high-quality journalism. We strive to provide comprehensive coverage of local and international news, sports, entertainment, technology, and opinion pieces.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4">Our Team</h2>
          <p>
            Our dedicated team of experienced journalists, editors, and content creators work tirelessly to bring you the most relevant and impactful stories. With diverse backgrounds and expertise, we ensure a well-rounded perspective on the issues that matter most.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4">Our Values</h2>
          <ul>
            <li>Integrity: We uphold the highest standards of journalistic ethics and transparency.</li>
            <li>Accuracy: We are committed to fact-checking and providing reliable information.</li>
            <li>Impartiality: We present balanced and unbiased reporting on all issues.</li>
            <li>Innovation: We embrace new technologies to deliver news in engaging and accessible ways.</li>
          </ul>
          <p className="mt-6">
            Thank you for choosing TheHit.in as your go-to news source. We appreciate your trust and look forward to keeping you informed and engaged.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

