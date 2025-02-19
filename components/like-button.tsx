'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react'
import { likeArticle, unlikeArticle } from '@/lib/article-utils'
import { useSession } from 'next-auth/react'

export function LikeButton({ articleId, initialLikes }: { articleId: string; initialLikes: number }) {
 const [likes, setLikes] = useState(initialLikes)
 const [isLiked, setIsLiked] = useState(false)
 const [isLoading, setIsLoading] = useState(false)
 const { data: session } = useSession()

 useEffect(() => {
  const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}')
  setIsLiked(!!likedArticles[articleId])
 }, [articleId])

 const handleLike = async () => {
  if (isLoading) return
  setIsLoading(true)
  try {
    if (isLiked) {
     const newLikes = await unlikeArticle(articleId)
     setLikes(newLikes >= 0 ? newLikes : 0)
     setIsLiked(false)
     updateLocalStorage(false)
    } else {
     const newLikes = await likeArticle(articleId)
     setLikes(newLikes)
     setIsLiked(true)
     updateLocalStorage(true)
    }
  } catch (error) {
    console.error('Error liking/unliking article:', error)
  } finally {
    setIsLoading(false)
  }
 }

 const updateLocalStorage = (liked: boolean) => {
  if (!session) {
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}')
    if (liked) {
     likedArticles[articleId] = true
    } else {
     delete likedArticles[articleId]
    }
    localStorage.setItem('likedArticles', JSON.stringify(likedArticles))
  }
 }

 return (
  <Button onClick={handleLike} variant="outline" className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : ''}`} disabled={isLoading}>
    <Heart className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} />
    <span>{likes} Likes</span>
  </Button>
 )
}
