import { siteConfig } from "@/config/site"

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Terms and Conditions</h1>
      <div className="prose max-w-none dark:prose-invert">
        <p className="text-muted-foreground">Effective Date: {
          new Date().toLocaleDateString() 
          // or you can use the date from the site config
          // siteConfig.termsEffectiveDate
          }</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Introduction</h2>
        <p>
          Welcome to LexInvictus! By using our website and services, you agree to comply with these Terms and
          Conditions. Please read them carefully.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Use of the Website</h2>
        <p>
          You must be at least 18 years old or have the consent of a parent or guardian to use our services. You agree
          to use LexInvictus only for lawful purposes.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. Account and Registration</h2>
        <p>
          To access certain features, such as submitting articles or booking mentorship sessions, you may be required to
          register an account. You agree to provide accurate and complete information when registering and to keep your
          account information secure.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. User-Generated Content</h2>
        <p>
          By submitting content (e.g., articles, experiences) to LexInvictus, you grant us a non- exclusive, worldwide,
          royalty-free license to display, distribute, and use your content on the platform.
        </p>
        <p>
          You are solely responsible for the content you submit. We reserve the right to remove any content that
          violates our guidelines or is deemed inappropriate.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. Mentorship and Services</h2>
        <p>
          LexInvictus provides a platform for mentorship sessions with Ranjeet Saw and other legal professionals. By
          booking a session, you agree to comply with the terms of the mentorship services, including any cancellation
          or rescheduling policies.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">5. Opportunities</h2>
        <p>
          LexInvictus may list job, internship, and publication opportunities on the website. We do not guarantee the
          availability of these opportunities or the accuracy of the listings. You are responsible for verifying the
          details of any opportunity you apply for.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">6. Prohibited Activities</h2>
        <p>You agree not to engage in any of the following:</p>
        <ul>
          <li>Violating any applicable laws or regulations.</li>
          <li>Posting false or misleading content.</li>
          <li>Interfering with or disrupting the website's operation.</li>
          <li>Engaging in any activity that could harm the LexInvictus community.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">7. Limitation of Liability</h2>
        <p>
          LexInvictus is not liable for any direct, indirect, incidental, or consequential damages arising from your use
          of the website, including any loss of data, opportunities, or user-generated content.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">8. Termination</h2>
        <p>
          We may suspend or terminate your access to LexInvictus if you violate these Terms and Conditions or engage in
          unlawful conduct. You can also terminate your account at any time by contacting us.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">9. Changes to the Terms and Conditions</h2>
        <p>
          We may update these Terms and Conditions from time to time. Any changes will be posted on this page, and the
          effective date will be updated accordingly.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">10. Governing Law</h2>
        <p>
          These Terms and Conditions are governed by the laws of India. Any disputes will be resolved through mediation.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">11. Contact Us</h2>
        <p>For any questions regarding these Terms and Conditions, please contact us at:</p>
        <p>Email: {siteConfig.contact.email}</p>
        <p>Phone: {siteConfig.contact.phone}</p>
      </div>
    </div>
  )
}

