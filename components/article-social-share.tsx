"use client";

import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Linkedin,
  LinkIcon,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ArticleSocialShareProps {
  url: string;
  title: string;
  articleId: string;
  shares: number;
}

export function ArticleSocialShare({
  url,
  title,
  articleId,
  shares,
}: ArticleSocialShareProps) {
  const [shareCount, setShareCount] = useState(shares);
  const [isSharing, setIsSharing] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
  };

  const incrementShareCount = async () => {
    try {
      const response = await fetch(`/api/articles/${articleId}/share`, {
        method: "POST",
      });
      if (response.ok) {
        setShareCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Failed to increment share count:", error);
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank");
    incrementShareCount();
  };

  const copyToClipboard = async () => {
    if (isSharing) return;
    setIsSharing(true);

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      } else {
        toast.error("Clipboard Not Supported", {
          description: "Your browser does not support clipboard copying.",
        });
      }
      incrementShareCount();
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 py-6">
      {/* Share Count */}
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {shareCount}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Shares</div>
      </div>

      {/* Social Share Icons */}
      <div className="flex flex-col space-y-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare("facebook")}
          aria-label="Share on Facebook"
          className="rounded-full hover:bg-gray-100 hover:border-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-600"
        >
          <Facebook className="h-5 w-5 text-gray-900 dark:text-white" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare("twitter")}
          aria-label="Share on Twitter"
          className="rounded-full hover:bg-gray-100 hover:border-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-600"
        >
          <Twitter className="h-5 w-5 text-gray-900 dark:text-white" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare("linkedin")}
          aria-label="Share on LinkedIn"
          className="rounded-full hover:bg-gray-100 hover:border-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-600"
        >
          <Linkedin className="h-5 w-5 text-gray-900 dark:text-white" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          aria-label="Copy link"
          className="rounded-full hover:bg-gray-100 hover:border-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-600"
          disabled={isSharing}
        >
          <LinkIcon className="h-5 w-5 text-gray-900 dark:text-white" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          aria-label="Comment"
          className="rounded-full hover:bg-gray-100 hover:border-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-600"
        >
          <MessageCircle className="h-5 w-5 text-gray-900 dark:text-white" />
        </Button>
      </div>
    </div>
  );
}
