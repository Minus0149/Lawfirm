import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  Eye,
  Clock,
  Share2,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { SocialShare } from "@/components/social-share";
import { formatDate } from "@/lib/formatDate";
import TrendingNews from "@/components/trending-news";
import FeaturedCarousel from "@/components/featured-carousel";

interface ArticleSidebarProps {
  article: {
    id: string;
    title: string;
    imageUrl: string | null;
    imageFile: string | null;
    createdAt: Date;
    views: number;
    shares: number;
    content: string;
    author?: {
      name: string;
      imageFile?: string | null;
    } | null;
    category?: {
      name: string;
    } | null;
  };
}

// Function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function ArticleSidebar({ article }: ArticleSidebarProps) {
  const readingTime = calculateReadingTime(article.content);

  return (
    <div className="space-y-6">
      {/* Social Links Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Social Links
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <Link
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Facebook className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Facebook
            </span>
          </Link>

          <Link
            href={siteConfig.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-3 rounded-lg bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors"
          >
            <Twitter className="w-6 h-6 text-sky-600 dark:text-sky-400 mb-2" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Twitter
            </span>
          </Link>

          <Link
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
          >
            <Instagram className="w-6 h-6 text-pink-600 dark:text-pink-400 mb-2" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Instagram
            </span>
          </Link>

          <Link
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <Linkedin className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Pinterest
            </span>
          </Link>

          <div className="flex flex-col items-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer">
            <Youtube className="w-6 h-6 text-red-600 dark:text-red-400 mb-2" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Youtube
            </span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer">
            <MessageCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              SoundCloud
            </span>
          </div>
        </div>
      </Card>

      {/* Author Section */}
      {article.author && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Author
          </h3>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={`data:image/jpeg;base64,${
                  article.author?.imageFile || ""
                }`}
                alt={article.author.name || "Author"}
              />
              <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-lg">
                {article.author.name?.[0] || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {article.author.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Legal Writer & Expert
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Specializing in criminal law with proven track record in complex
                cases.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Trending News Section */}
      <TrendingNews />

      {/* Featured Carousel Section */}
      <FeaturedCarousel />
    </div>
  );
}
