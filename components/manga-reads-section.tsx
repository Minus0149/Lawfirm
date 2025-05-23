"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";

interface TrendingArticle {
  id: string;
  title: string;
  imageUrl: string | null;
  imageFile: Buffer | Uint8Array | null;
  createdAt: Date;
  author: {
    name: string;
    image: string | null;
    imageFile: Buffer | null;
  };
  category?: {
    id: string;
    name: string;
  };
}

export default function MangaReadsSection({
  selectedCategory,
}: {
  selectedCategory: string | null;
}) {
  const [trendingArticles, setTrendingArticles] = useState<TrendingArticle[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingArticles = async () => {
      setIsLoading(true);
      try {
        // First try to fetch from trending endpoint
        let response = await fetch("/api/articles/trending");
        let data;

        if (response.ok) {
          data = await response.json();
        } else {
          // Fallback to regular articles if trending endpoint fails
          const params = new URLSearchParams({
            public: "true",
            page: "1",
            pageSize: "6",
          });

          if (selectedCategory) {
            params.append("category", selectedCategory);
          }

          response = await fetch(`/api/articles?${params.toString()}`);
          if (response.ok) {
            data = await response.json();
            data = { articles: data.articles };
          }
        }

        if (data && data.articles) {
          let articles = data.articles;

          // Filter by category if selected and not already filtered
          if (selectedCategory && !response.url.includes("category=")) {
            articles = articles.filter(
              (article: TrendingArticle) =>
                article.category?.id === selectedCategory
            );
          }

          setTrendingArticles(articles.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching trending articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingArticles();
  }, [selectedCategory]);

  if (isLoading) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
        <div className="space-y-4">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-3 items-center animate-pulse">
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manga reads
        </h2>

        {/* Articles List */}
        {trendingArticles.length > 0 ? (
          <div className="space-y-4">
            {trendingArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="block group"
              >
                <article className="flex gap-3 items-center">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    {article.imageUrl || article.imageFile ? (
                      <Image
                        src={
                          article.imageUrl ||
                          `data:image/jpeg;base64,${
                            article.imageFile
                              ? Buffer.from(
                                  new Uint8Array(article.imageFile)
                                ).toString("base64")
                              : ""
                          }`
                        }
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <span className="text-white/70 text-xs">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDate(new Date(article.createdAt))}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="relative w-4 h-4 rounded-full overflow-hidden">
                        {article.author.imageFile ? (
                          <Image
                            src={`data:image/jpeg;base64,${
                              typeof article.author.imageFile === "string"
                                ? article.author.imageFile
                                : Buffer.from(
                                    new Uint8Array(article.author.imageFile)
                                  ).toString("base64")
                            }`}
                            alt={article.author.name || "User avatar"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {article.author.name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {article.author.name}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            No trending articles found.
          </p>
        )}
      </div>
    </div>
  );
}
