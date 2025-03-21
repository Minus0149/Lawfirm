import { Suspense } from 'react'
import { Category } from "@prisma/client"
import dynamic from 'next/dynamic'
import { Advertisement } from '@/components/advertisement'
import { ArticleListSkeleton, TrendingNewsSkeleton } from '@/components/skeletons'
import { fetchArticles } from '@/lib/api'
import { LoadingScreen } from '@/components/loading-screen'
import { MentorshipSection } from '@/components/mentorship-card'

const ArticleList = dynamic(() => import('@/components/article-list'), {
  loading: () => <ArticleListSkeleton />
})

const TrendingNews = dynamic(() => import('@/components/trending-news'), {
  loading: () => <TrendingNewsSkeleton />
})

interface PageProps {
  searchParams: {
    page?: string
    category?: Category
  }
}

export default async function Home({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1')
  const pageSize = 6
  const category = searchParams.category

  const { articles, totalArticles } = await fetchArticles(page, pageSize, category)

  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Advertisement position="TOP_BANNER" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 mt-5">
        <h1 className="text-5xl font-bold leading-[64px] md:col-span-2">Exploring New <br/>Articles</h1>
        <p className='w-96 my-auto leading-8 text-lg'>Dive into a world of insights, ideas, and inspiration. Stay updated with the latest trends shaping our present and future.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
          <div className="md:col-span-2">
            <Suspense fallback={<ArticleListSkeleton />}>
              <ArticleList
                initialArticles={articles}
                totalArticles={totalArticles}
                currentPage={page}
                pageSize={pageSize}
                category={category}
              />
            </Suspense>
          </div>

          <div className="md:col-span-1">
            <div className="sticky">
              <Suspense fallback={<TrendingNewsSkeleton />}>
                <TrendingNews />
              </Suspense>
            </div>
          </div>
        </div>
        <MentorshipSection />
      </div>
    </Suspense>
  )
}

