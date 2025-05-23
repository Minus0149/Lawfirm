"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/formatDate";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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
}

export default function TrendingNews() {
  const [trendingArticles, setTrendingArticles] = useState<TrendingArticle[]>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        const response = await fetch("/api/articles/trending");
        if (!response.ok) {
          throw new Error("Failed to fetch trending articles");
        }
        const data = await response.json();
        setTrendingArticles(data.articles);
      } catch (error) {
        console.error("Error fetching trending articles:", error);
        setError("Failed to load trending articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingArticles();
  }, []);

  useEffect(() => {
    if (trendingArticles.length === 0 || isPaused) return;

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % trendingArticles.length
        );
      }, 5000); // Change article every 5 seconds
    };

    startInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [trendingArticles, isPaused]);

  const handlePrevious = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + trendingArticles.length) % trendingArticles.length
    );
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % trendingArticles.length
        );
      }, 5000);
    }
  };

  const handleNext = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % trendingArticles.length);
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % trendingArticles.length
        );
      }, 5000);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Trending</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="animate-pulse bg-gray-300 h-full w-full rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Trending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (trendingArticles.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto py-0 px-4 rounded-none">
      <h2 className="text-xl font-semibold mb-4 rounded-none">Trending Post</h2>
      <div className="space-y-4 rounded-none">
        {trendingArticles.map((post) => (
          <article key={post.id} className="flex gap-3 items-center">
            <Link
              href={`/article/${post.id}`}
              className="shrink-0 rounded-none"
            >
              <Image
                src={
                  post.imageUrl ||
                  `data:image/jpeg;base64,${
                    post.imageFile
                      ? Buffer.from(new Uint8Array(post.imageFile)).toString(
                          "base64"
                        )
                      : ""
                  }`
                }
                alt={post.title}
                width={136.25}
                height={136.25}
                className="object-cover w-[136.25px] h-[136.25px] rounded-xl"
              />
            </Link>
            <div className="flex flex-col min-w-0">
              <span className="text-xs mb-1">{formatDate(post.createdAt)}</span>
              <Link
                href={`/article/${post.id}`}
                className="font-semibold leading-snug text-base hover:underline line-clamp-2 mt-0.5"
              >
                {post.title}
              </Link>
              <div className="flex items-center gap-2 mt-2">
                <div className="relative w-6 h-6 rounded-full overflow-hidden">
                  {post.author.imageFile ? (
                    <Image
                      src={`data:image/jpeg;base64,${
                        typeof post.author.imageFile === "string"
                          ? post.author.imageFile
                          : Buffer.from(
                              new Uint8Array(post.author.imageFile)
                            ).toString("base64")
                      }`}
                      alt={post.author.name || "User avatar"}
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">
                        {post.author.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {post.author.name}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
