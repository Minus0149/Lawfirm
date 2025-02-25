import './globals.css'
import { Montserrat } from 'next/font/google'
import { Providers } from './providers'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import { Suspense } from 'react'
import { LoadingScreen } from '@/components/loading-screen'
import { ConditionalHeader } from '@/components/conditional-header'
import { ConditionalFooter } from '@/components/conditional-footer'
import { prisma } from '@/lib/prisma'
import { FloatingOverlay } from '@/components/floating-overlay'
import { Toaster } from "@/components/ui/sonner"
import { Metadata } from 'next'
import { siteConfig } from "@/config/site"
import { CanonicalUrl } from "@/components/canonical-url"
import Head from 'next/head'


export const dynamic = "force-dynamic"

const montserrat = Montserrat({
  subsets: ["latin"],
  preload: true,
  display: "block",
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://lexinvictus.vercel.app"),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "legal education",
    "law students",
    "legal resources",
    "law mentorship",
    "legal articles",
    "law notes",
    "legal community",
    "law school",
    "legal career",
    "legal drafting",
  ],
  authors: [
    {
      name: "LexInvictus Team",
      url: process.env.NEXT_PUBLIC_APP_URL,
    },
  ],
  creator: "LexInvictus",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og.png`],
    creator: "@lexinvictus",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await prisma.category.findMany()

  return (
    <html lang="en" suppressHydrationWarning className={montserrat.variable}>
      <Head>
      <meta name="google-site-verification" content="P-JC1LpMI31989c2hqCwvPJpdxsXrDwfohFUsIzLHFI" />
        <CanonicalUrl />
      </Head>
      <body className={`min-h-screen bg-background text-foreground font-sans scroll-smooth ${montserrat.variable}`}>
        <Providers>
          
            <Suspense fallback={<LoadingScreen />}>
              <ConditionalHeader categories={categories} />
            </Suspense>
          
          <main className="flex-1">
            <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
          </main>
          
            <Suspense fallback={<LoadingScreen />}>
              <ConditionalFooter />
            </Suspense>
       
        </Providers>

        <Analytics />
        <SpeedInsights />
        <Toaster position="bottom-right" />
        <FloatingOverlay />
      </body>
    </html>
  )
}
