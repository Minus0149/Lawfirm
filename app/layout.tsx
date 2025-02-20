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
import { HomeIcon } from "lucide-react"
import Link from 'next/link'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'LexInvictus - the lawfirm you can trust',
  description: 'LexInvictus is a law firm that provides legal services to clients in the areas of corporate and commercial law, real estate, intellectual property, and litigation.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const categories = await prisma.category.findMany()

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground font-sans scroll-smooth">
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
        <Link href="/" passHref>
          <button className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <HomeIcon className="w-6 h-6" />
          </button>
        </Link>
      </body>
    </html>
  )
}
