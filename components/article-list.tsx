'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/article'
import { formatDate } from '@/lib/formatDate'
import { stripHtmlAndTruncate } from '@/lib/textUtils'
import { Advertisement } from '@/components/advertisement'
import { Category } from '@prisma/client'
import { Pagination } from '@/components/pagination'
import { bufferToBase64 } from '@/lib/utils'

interface ArticleListProps {
  initialArticles: Article[]
  category?: Category
  totalArticles: number
  currentPage: number
  pageSize: number
}

export default function ArticleList({ 
  initialArticles, 
  category, 
  totalArticles, 
  currentPage, 
  pageSize 
}: ArticleListProps) {
  const [articles, setArticles] = useState(initialArticles)
  const [page, setPage] = useState(currentPage)

  const totalPages = Math.ceil(totalArticles / pageSize)

  useEffect(() => {
    setArticles(initialArticles)
    setPage(currentPage)
  }, [initialArticles, currentPage])

  


  if (!articles || articles.length === 0) {
    return <div className="text-muted-foreground">No articles found.</div>
  }


  return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article, index) => (
            <React.Fragment key={article.id}>
              {index > 0 && index % 4 === 0 && (
                <div className="col-span-full my-4">
                  {/* <Advertisement placement="IN_ARTICLE" /> */}
                </div>
              )}
              <article className="border rounded-lg overflow-hidden shadow-sm bg-card">
                <Link href={`/article/${article.id}`}>
                  <div className="relative h-48">
                    {article.imageUrl || article.imageFile ? (
                      <Image
                        src={article.imageUrl || `data:image/jpeg;base64,${article.imageFile instanceof Uint8Array ? bufferToBase64(article.imageFile) : article.imageFile}`}
                        alt={article.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        No image available
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2 text-foreground">
                      {article.title}
                    </h2>
                    <p className="text-muted-foreground mb-2 text-sm">
                      By {article?.author?.name || 'Unknown'} | {formatDate(new Date(article.createdAt))}
                    </p>
                    <p className="text-foreground line-clamp-3" dangerouslySetInnerHTML={{ __html: stripHtmlAndTruncate(article.content, 150) }}>
                    </p>
                  </div>
                </Link>
              </article>
            </React.Fragment>
          ))}
        </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/${category?.name.toLowerCase().replace('_', '-') || ''}`}
        />
      )}
    </div>
  )
}

