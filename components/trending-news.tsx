'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Article } from '@/types/article'

interface TrendingArticle {
  id: string
  title: string
  imageUrl: string | null
  imageFile: Buffer | Uint8Array | null
}

export default function TrendingNews() {
  const [trendingArticles, setTrendingArticles] = useState<TrendingArticle[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        const response = await fetch('/api/articles/trending')
        if (!response.ok) {
          throw new Error('Failed to fetch trending articles')
        }
        const data = await response.json()
        setTrendingArticles(data.articles)
      } catch (error) {
        console.error('Error fetching trending articles:', error)
        setError('Failed to load trending articles')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrendingArticles()
  }, [])

  useEffect(() => {
    if (trendingArticles.length === 0 || isPaused) return

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % trendingArticles.length)
      }, 5000) // Change article every 5 seconds
    }

    startInterval()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [trendingArticles, isPaused])

  const handlePrevious = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setCurrentIndex((prevIndex) => (prevIndex - 1 + trendingArticles.length) % trendingArticles.length)
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % trendingArticles.length)
      }, 5000)
    }
  }

  const handleNext = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % trendingArticles.length)
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % trendingArticles.length)
      }, 5000)
    }
  }

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
    )
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
    )
  }

  if (trendingArticles.length === 0) {
    return null
  }

  const currentArticle = trendingArticles[currentIndex]

  return (
    <Card 
      className="w-full max-w-md mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <CardHeader>
        <CardTitle>Trending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentArticle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <div className="relative h-48 w-full rounded-md overflow-hidden">
                {currentArticle.imageUrl || currentArticle.imageFile ? (
                  <Image
                    src={currentArticle.imageUrl || `data:image/jpeg;base64,${currentArticle.imageFile ? Buffer.from(new Uint8Array(currentArticle.imageFile)).toString('base64') : ''}`}
                    alt={currentArticle.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No image available
                  </div>
                )}
              </div>
              <Link href={`/article/${currentArticle.id}`} className="block hover:text-primary transition-colors duration-200">
                <h3 className="text-base font-semibold line-clamp-2">{currentArticle.title}</h3>
              </Link>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={handlePrevious} aria-label="Previous article">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} of {trendingArticles.length}
            </span>
            <Button variant="outline" size="sm" onClick={handleNext} aria-label="Next article">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

