"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Eye, Share2 } from "lucide-react";
import SharedCategoryNav from "./shared-category-nav";
import { stripHtmlAndTruncate } from "@/lib/textUtils";

interface Article {
  id: string;
  title: string;
  content: string;
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

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export default function FeaturedArticlesSection({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          public: "true",
          page: "1",
          pageSize: "5",
        });

        if (selectedCategory) {
          params.append("category", selectedCategory);
        }

        const response = await fetch(`/api/articles?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory]);

  // Flatten categories for navigation
  const flattenCategories = (cats: Category[]): Category[] => {
    return cats.reduce((acc: Category[], category: Category) => {
      acc.push(category);
      if (category.children) {
        acc.push(...flattenCategories(category.children));
      }
      return acc;
    }, []);
  };

  const allCategories = flattenCategories(categories);

  if (isLoading) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
        <div className="space-y-4">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-3 animate-pulse bg-gray-300 dark:bg-gray-700 h-80 rounded"></div>
            <div className="col-span-1 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-300 dark:bg-gray-700 h-16 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Latest Articles
        </h2>
        <p className="text-gray-600 dark:text-gray-400">No articles found.</p>
      </div>
    );
  }

  const [featuredArticle, ...smallerArticles] = articles;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Latest Articles
        </h2>

        {/* Main Content Grid: 3 columns for featured + 1 column for smaller articles */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Large Featured Article - Takes 3 columns - Article Card Style */}
          <div className="col-span-1 md:col-span-3">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                {featuredArticle.imageUrl || featuredArticle.imageFile ? (
                  <Image
                    src={
                      featuredArticle.imageUrl ||
                      `data:image/jpeg;base64,${
                        featuredArticle.imageFile
                          ? Buffer.from(
                              new Uint8Array(featuredArticle.imageFile)
                            ).toString("base64")
                          : ""
                      }`
                    }
                    alt={featuredArticle.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 75vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-white/70">No image available</span>
                  </div>
                )}

                {/* Category Overlay - Top Left */}
                {featuredArticle.category && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium uppercase tracking-wider text-white border border-white/30">
                      {featuredArticle.category.name.replace("_", " ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                {/* Date */}
                <div>
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(new Date(featuredArticle.createdAt))}
                  </time>
                </div>

                {/* Title */}
                <Link href={`/article/${featuredArticle.id}`}>
                  <h3 className="text-xl font-semibold leading-tight line-clamp-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {featuredArticle.title}
                  </h3>
                </Link>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                  {stripHtmlAndTruncate(featuredArticle.content, 150)}
                </p>

                {/* View Post Link */}
                <Link
                  href={`/article/${featuredArticle.id}`}
                  className="inline-block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-colors underline underline-offset-2"
                >
                  View Post
                </Link>
              </div>
            </div>
          </div>

          {/* Smaller Articles - Takes 1 column, 4 rows - Trending Card Style */}
          <div className="col-span-1 space-y-4">
            {smallerArticles.slice(0, 4).map((article) => (
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
                    <h4 className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h4>
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
        </div>
      </div>
    </div>
  );
}
