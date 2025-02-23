"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Article } from "@/types/article"
import { formatDate } from "@/lib/formatDate"
import { stripHtmlAndTruncate } from "@/lib/textUtils"
import type { Category } from "@prisma/client"
import { bufferToBase64 } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight } from "lucide-react"

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
  pageSize,
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
    <div className="space-y-12 rounded-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {articles.map((article, index) => (
          <article key={article.id} className="group space-y-4">
            <Link href={`/article/${article.id}`} className="block">
              <div className="relative h-64 overflow-hidden rounded-none">
                {article.imageUrl || article.imageFile ? (
                  <Image
                    src={
                      article.imageUrl ||
                      `data:image/jpeg;base64,${article.imageFile instanceof Uint8Array ? bufferToBase64(article.imageFile) : article.imageFile}`
                    }
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-none"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No image available</span>
                  </div>
                )}
              </div>
            </Link>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={`data:image/jpeg;base64,${typeof article.author?.imageFile === 'string' ? article.author.imageFile : Buffer.from(new Uint8Array(article.author?.imageFile || new Uint8Array())).toString('base64')}`} alt={article.author?.name || "Author"} />
                  <AvatarFallback>{article.author?.name?.[0] || "A"}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground ml-0.5">{article.author?.name || "Unknown"}</span>
                <span className="text-sm text-muted-foreground ml-0.5">•</span>
                <time className="text-sm text-muted-foreground ml-0.5">{formatDate(new Date(article.createdAt))}</time>
              </div>

              <Link href={`/article/${article.id}`}>
                <h2 className="text-xl font-semibold leading-tight group-hover:text-primary dark:group-hover:text-blue-500 transition-colors mt-1">
                  {article.title}
                </h2>
              </Link>

              <p className="text-muted-foreground line-clamp-2">{stripHtmlAndTruncate(article.content, 150)}</p>

              <Link
                href={`/article/${article.id}`}
                className="inline-flex items-center text-sm font-medium transition-colors tracking-wider bg-[#F4F4F4] dark:bg-slate-400 py-[10px] px-[16px]"
              >
                READ MORE
                <ChevronRight className="ml-2 mb-0.5 h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Link
              key={pageNum}
              href={`/${category?.name.toLowerCase().replace("_", "-") || ""}?page=${pageNum}`}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm ${
                pageNum === page ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {pageNum}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

