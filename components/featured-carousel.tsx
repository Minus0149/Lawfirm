"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface FeaturedArticle {
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
}

export default function FeaturedCarousel() {
  const [featuredArticles, setFeaturedArticles] = useState<FeaturedArticle[]>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        const response = await fetch(
          "/api/articles?public=true&page=1&pageSize=5"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch featured articles");
        }
        const data = await response.json();
        setFeaturedArticles(data.articles);
      } catch (error) {
        console.error("Error fetching featured articles:", error);
        setError("Failed to load featured articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, []);

  useEffect(() => {
    if (featuredArticles.length === 0) return;

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % featuredArticles.length
        );
      }, 4000); // Change article every 4 seconds
    };

    startInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [featuredArticles]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % featuredArticles.length
        );
      }, 4000);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Featured
        </h3>
        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-64 w-full rounded"></div>
      </div>
    );
  }

  if (error || featuredArticles.length === 0) {
    return null;
  }

  const currentArticle = featuredArticles[currentIndex];

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        {/* Article Card */}
        <div className="relative h-80 overflow-hidden">
          {currentArticle.imageUrl || currentArticle.imageFile ? (
            <Image
              src={
                currentArticle.imageUrl ||
                `data:image/jpeg;base64,${
                  currentArticle.imageFile
                    ? Buffer.from(
                        new Uint8Array(currentArticle.imageFile)
                      ).toString("base64")
                    : ""
                }`
              }
              alt={currentArticle.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-white/70">No image available</span>
            </div>
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20"></div>

          {/* Content overlay */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
            {/* All content at bottom left */}
            <div className="space-y-3">
              {/* Date */}
              <time className="text-sm font-medium text-white">
                {formatDate(new Date(currentArticle.createdAt))}
              </time>

              {/* Title */}
              <h4 className="text-2xl font-bold leading-tight line-clamp-2 text-white max-w-xs">
                {currentArticle.title}
              </h4>

              {/* User info */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                  {currentArticle.author.imageFile ? (
                    <Image
                      src={`data:image/jpeg;base64,${
                        typeof currentArticle.author.imageFile === "string"
                          ? currentArticle.author.imageFile
                          : Buffer.from(
                              new Uint8Array(currentArticle.author.imageFile)
                            ).toString("base64")
                      }`}
                      alt={currentArticle.author.name || "User avatar"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {currentArticle.author.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-base font-medium text-white">
                  {currentArticle.author.name}
                </span>
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center space-x-3 pt-2 w-full">
                {featuredArticles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-white"
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Click overlay for navigation */}
          <Link
            href={`/article/${currentArticle.id}`}
            className="absolute inset-0 z-10"
            aria-label={`Read article: ${currentArticle.title}`}
          />
        </div>
      </div>
    </div>
  );
}
