import { prisma } from '@/lib/prisma'
import ArticleList from '@/components/article-list'
import { Article } from '@/types/article'
import { fetchSearchedArticles } from '@/lib/api'

export default async function SearchResults({ searchParams }: { searchParams: { q?: string, page?: string } }) {
 const page = parseInt(searchParams.page || '1')
 const pageSize = 6
 const searchTerm = searchParams.q || ''

 const { articles, totalArticles } = await fetchSearchedArticles(searchTerm, page, pageSize)

 return (
   <div className="container mx-auto px-4 py-8">
     <h1 className="text-3xl font-bold mb-6">Search Results for "{searchTerm}"</h1>
     <ArticleList 
       initialArticles={articles} 
       totalArticles={totalArticles}
       currentPage={page}
       pageSize={pageSize}
     />
   </div>
 )
}

