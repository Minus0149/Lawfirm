'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Share2 } from 'lucide-react'
import { shareArticle } from '@/lib/article-utils'
import { toast } from "@/components/ui/use-toast"

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
        toast({
          title: "Link Copied!",
          description: "The article link has been copied to your clipboard.",
        })
      } else {
        toast({
          title: "Clipboard Not Supported",
          description: "Your browser does not support clipboard copying.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share the article. Please try again.",
        variant: "destructive",
      })
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
