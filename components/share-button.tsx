'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Share2 } from 'lucide-react'
import { shareArticle } from '@/lib/article-utils'
import { toast } from "sonner"

export function ShareButton({ articleId, initialShares }: { articleId: string; initialShares: number }) {
  const [shares, setShares] = useState(initialShares)
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    if (isSharing) return
    setIsSharing(true)

    try {
      const newShares = await shareArticle(articleId)
      setShares(newShares)

      const articleUrl = `${window.location.origin}/article/${articleId}`
      
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(articleUrl)
        toast.success("Article URL copied to clipboard")
      } else {
        toast.error("Clipboard Not Supported",{
          description: "Your browser does not support clipboard copying.",
        })
      }
    } catch (error) {
      toast.error("Failed to share article. Please try again.")
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Button 
      onClick={handleShare} 
      variant="outline" 
      className="flex items-center gap-2"
      disabled={isSharing}
      aria-label="Share this article"
    >
      <Share2 className="h-4 w-4" />
      <span>{shares} Shares</span>
    </Button>
  )
}
