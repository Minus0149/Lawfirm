"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/article";
import { formatDate } from "@/lib/formatDate";
import { stripHtmlAndTruncate } from "@/lib/textUtils";
import type { Category } from "@prisma/client";
import { bufferToBase64 } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Eye, Share2 } from "lucide-react";
import dynamic from "next/dynamic";
import TrendingNews from "@/components/trending-news";
import FeaturedCarousel from "@/components/featured-carousel";

interface ArticleListProps {
  initialArticles: Article[];
  category?: Category;
  totalArticles: number;
  currentPage: number;
  pageSize: number;
  isHomepage?: boolean;
}

export default function ArticleList({
  initialArticles,
  category,
  totalArticles,
  currentPage,
  pageSize,
  isHomepage = false,
}: ArticleListProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [page, setPage] = useState(currentPage);
  const [loading, setLoading] = useState(false);

  // Calculate total pages: first page has 7 articles, subsequent pages have 6
  const remainingArticles = Math.max(0, totalArticles - 7);
  const totalPages =
    remainingArticles > 0 ? Math.ceil(remainingArticles / 6) + 1 : 1;

  useEffect(() => {
    setArticles(initialArticles);
    setPage(currentPage);
  }, [initialArticles, currentPage]);

  const loadMoreArticles = async () => {
    if (loading || page >= totalPages) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const loadMorePageSize = 6; // Use 6 for load more instead of 7
      const params = new URLSearchParams({
        public: "true",
        page: nextPage.toString(),
        pageSize: loadMorePageSize.toString(),
      });

      if (category) {
        params.append("category", category.id);
      }

      const response = await fetch(`/api/articles?${params.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setArticles((prev) => [...prev, ...data.articles]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!articles || articles.length === 0) {
    return <div className="text-muted-foreground">No articles found.</div>;
  }

  // Different layouts for homepage vs other pages
  if (isHomepage) {
    // Split articles for the special homepage layout
    const firstFourArticles = articles.slice(0, 4);
    const restOfArticles = articles.slice(4);

    return (
      <div className="space-y-8">
        {/* First 2 rows: 2 cols articles + 1 col trending news */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* First 4 articles in 2 columns */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {firstFourArticles.map((article, index) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          {/* Trending News in 3rd column - only on homepage */}
          <div className="lg:col-span-1 space-y-8">
            <TrendingNews />
            <FeaturedCarousel />
          </div>
        </div>

        {/* Remaining articles in 3 columns */}
        {restOfArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restOfArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {page < totalPages && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMoreArticles}
              disabled={loading}
              className="px-8 py-3 bg-transparent border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-medium transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    );
  } else {
    // Simple grid layout for non-homepage
    return (
      <div className="space-y-8">
        {/* All articles in a consistent grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Load More Button */}
        {page < totalPages && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMoreArticles}
              disabled={loading}
              className="px-8 py-3 bg-transparent border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-medium transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    );
  }
}

// Article Card Component
function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-[#141414]">
      {/* Image Section with Category Overlay */}
      <div className="relative h-48 overflow-hidden">
        {article.imageUrl || article.imageFile ? (
          <Image
            src={
              article.imageUrl ||
              `data:image/jpeg;base64,${
                article.imageFile instanceof Uint8Array
                  ? bufferToBase64(article.imageFile)
                  : article.imageFile
              }`
            }
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <span className="text-white/70">No image available</span>
          </div>
        )}

        {/* Category Overlay - Top Left */}
        {article.category && (
          <div className="absolute top-4 left-4">
            <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium uppercase tracking-wider text-white border border-white/30">
              {article.category.name.replace("_", " ")}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h2 className="text-xl font-semibold leading-tight line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </h2>

        {/* User Info, Date, and Shares in one line */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`data:image/jpeg;base64,${
                  typeof article.author?.imageFile === "string"
                    ? article.author.imageFile
                    : Buffer.from(
                        new Uint8Array(
                          article.author?.imageFile || new Uint8Array()
                        )
                      ).toString("base64")
                }`}
                alt={article.author?.name || "Author"}
              />
              <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {article.author?.name?.[0] || "A"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {article.author?.name || "Unknown"}
            </span>
            <time className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(new Date(article.createdAt))}
            </time>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              <span>{article.shares}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
          {stripHtmlAndTruncate(article.content, 150)}
        </p>

        {/* View Post Link */}
        <Link
          href={`/article/${article.id}`}
          className="inline-block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-colors underline underline-offset-2"
        >
          View Post
        </Link>
      </div>
    </Card>
  );
}
