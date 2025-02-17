import { siteConfig } from "@/config/site"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Privacy Policy</h1>
      <div className="prose max-w-none dark:prose-invert">
          <p className="text-muted-foreground">Effective Date: {
          new Date().toLocaleDateString() 
          // or you can use the date from the site config
          // siteConfig.termsEffectiveDate
          }</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Introduction</h2>
        <p>
          At LexInvictus, your privacy is of paramount importance to us. This Privacy Policy explains how we collect,
          use, and safeguard your personal data when you visit our website, submit your experiences, or engage with our
          services.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul>
          <li>Personal Identification Information: Name, email address, contact details, etc.</li>
          <li>Non-Personal Information: Browser type, IP address, and website usage data.</li>
          <li>Submitted Content: Articles, experiences, documents, and other content you provide.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
        <p>We use your information for the following purposes:</p>
        <ul>
          <li>To provide, maintain, and improve our services.</li>
          <li>To personalize your experience on our website.</li>
          <li>To communicate with you regarding updates, opportunities, or mentorship sessions.</li>
          <li>To publish user-generated content (articles, experiences) on the platform.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal data against
          unauthorized access, alteration, or destruction.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. Sharing of Information</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. However, we may share data with
          trusted third-party service providers to facilitate our services, such as hosting providers or payment
          processors.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">5. Cookies</h2>
        <p>
          Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your
          browser settings, but some features of the website may not function properly.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access and update your personal information.</li>
          <li>Delete your account or submitted content upon request.</li>
          <li>Withdraw your consent to process your data (subject to applicable laws).</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">7. Changes to the Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the
          new policy on this page.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">8. Contact Us</h2>
        <p>For any questions or concerns regarding your privacy, please contact us at:</p>
        <p>Email: {siteConfig.contact.email}</p>
        <p>Phone: {siteConfig.contact.phone}</p>
      </div>
    </div>
  )
}

