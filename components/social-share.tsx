'use client'

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, LinkIcon, Share2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ShareButton } from "./share-button"

interface SocialShareProps {
  url: string
  title: string
  articleId: string
  initialShares?: number
}

export function SocialShare({ url, title, articleId, initialShares=0 }: SocialShareProps) {
  const [shareCount, setShareCount] = useState(initialShares)
  const [isSharing, setIsSharing] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
  }

  const incrementShareCount = async () => {
    try {
      const response = await fetch(`/api/articles/${articleId}/share`, { method: "POST" })
      if (response.ok) {
        setShareCount((prevCount) => prevCount + 1)
      }
    } catch (error) {
      console.error("Failed to increment share count:", error)
    }
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank")
    incrementShareCount()
  }

  const copyToClipboard = async () => {
    if (isSharing) return
    setIsSharing(true)

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard")
      } else {
        toast.error("Clipboard Not Supported", {
          description: "Your browser does not support clipboard copying.",
        })
      }
      incrementShareCount()
    } catch (err) {
      console.error("Failed to copy:", err)
      toast.error("Failed to copy link. Please try again.")
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => handleShare("facebook")} aria-label="Share on Facebook">
        <Facebook className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => handleShare("twitter")} aria-label="Share on Twitter">
        <Twitter className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => handleShare("linkedin")} aria-label="Share on LinkedIn">
        <Linkedin className="h-4 w-4" />
      </Button>
      <ShareButton articleId={articleId} initialShares={shareCount} />
    </div>
  )
}
