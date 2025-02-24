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

const montserrat = Montserrat({
  subsets: ["latin"],
  preload: true,
  display: "block",
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "LexInvictus - Legal Education Platform",
  description: "Professional Legal Education and Resources",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const categories = await prisma.category.findMany()

  return (
    <html lang="en" suppressHydrationWarning className={montserrat.variable}>
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
