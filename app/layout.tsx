import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import { Suspense } from 'react'
import { LoadingScreen } from '@/components/loading-screen'
import { ConditionalHeader } from '@/components/conditional-header'
import { ConditionalFooter } from '@/components/conditional-footer'
import { prisma } from '@/lib/prisma'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'TheHit.in - Latest News and Updates',
  description: 'Stay informed with the latest news and updates from TheHit.in',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const categories = await prisma.category.findMany()

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground font-sans">
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
      </body>
    </html>
  )
}
