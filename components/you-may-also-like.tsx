"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Eye, Share2 } from "lucide-react";
import { bufferToBase64 } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  imageFile: string | Uint8Array | null;
  createdAt: Date;
  views: number;
  shares: number;
  author?: {
    name: string;
    imageFile?: string | null;
  } | null;
  category?: {
    id: string;
    name: string;
  } | null;
}

interface YouMayAlsoLikeProps {
  currentArticleId: string;
  categoryId?: string | null;
}

export function YouMayAlsoLike({
  currentArticleId,
  categoryId,
}: YouMayAlsoLikeProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          public: "true",
          page: "1",
          pageSize: "6",
          exclude: currentArticleId,
        });

        if (categoryId) {
          params.append("category", categoryId);
        }

        const response = await fetch(`/api/articles?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles || []);
        }
      } catch (error) {
        console.error("Error fetching related articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedArticles();
  }, [currentArticleId, categoryId]);

  if (isLoading) {
    return (
      <div className="my-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider">
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

// Article Card Component (replicating the design from ArticleList)
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.id}`}>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-[#141414]">
        {/* Image Section with Category Overlay */}
        <div className="relative h-48 overflow-hidden">
          {article.imageUrl || article.imageFile ? (
            <Image
              src={
                article.imageUrl ||
                `data:image/jpeg;base64,${
                  typeof article.imageFile === "string"
                    ? article.imageFile
                    : article.imageFile
                    ? Buffer.from(new Uint8Array(article.imageFile)).toString(
                        "base64"
                      )
                    : ""
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
          <h3 className="text-xl font-bold leading-tight line-clamp-2 text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
            {article.title}
          </h3>

          {/* User Info, Date, and Shares in one line */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`data:image/jpeg;base64,${
                    typeof article.author?.imageFile === "string"
                      ? article.author.imageFile
                      : article.author?.imageFile
                      ? Buffer.from(
                          new Uint8Array(article.author.imageFile)
                        ).toString("base64")
                      : ""
                  }`}
                  alt={article.author?.name || "Author"}
                />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {article.author?.name?.[0] || "A"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {article.author?.name || "Unknown"}
              </span>
              <time className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {formatDate(new Date(article.createdAt))}
              </time>
            </div>

            <div className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
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
        </div>
      </Card>
    </Link>
  );
}
