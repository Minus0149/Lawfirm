"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Article } from '@/types/article'
import { ArticlePreview } from "@/components/article-preview"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ArticlePreviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [articleData, setArticleData] = useState<Article | null>(null)
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(true) // Set initial loading state to true
  const [articles, setArticles] = useState<Article[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const response = await fetch(`/api/articles/${params.id}?${searchParams}`) // Fetch single article
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setArticleData(data)
        setIsLoading(false) // Set loading to false after fetching data
      } catch (error) {
        console.error('Error fetching article data:', error)
        toast({
          title: "Error",
          description: "Failed to load article data",
          variant: "destructive",
        })
        setIsLoading(false) // Set loading to false on error as well
      }
    }
    fetchArticleData()

    const fetchAllArticles = async () => { // Fetch all articles for navigation
      try {
        const res = await fetch(`/api/articles?${searchParams}`)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const allArticlesData = await res.json()
        setArticles(allArticlesData.articles)
        const index = allArticlesData.articles.findIndex((a: Article) => a.id === params.id)
        setCurrentIndex(index)
      } catch (error) {
        console.error('Error fetching all articles:', error)
      }
    }
    fetchAllArticles()
  }, [params.id, searchParams])

  const handleApproval = async (approved: boolean) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/articles/${params.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, comment }),
      })

      if (!response.ok) {
        throw new Error('Failed to update article status')
      }

      toast({
        title: approved ? "Article Approved" : "Article Rejected",
        description: `The article "${articleData?.title}" has been ${approved ? 'approved' : 'rejected'}.`,
      })

      router.push('/admin/approvals')
    } catch (error) {
      console.error('Error updating article status:', error)
      toast({
        title: "Error",
        description: "Failed to update article status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + articles.length) % articles.length
    setCurrentIndex(newIndex)
    setArticleData(articles[newIndex])
    router.push(`/admin/articles/${articles[newIndex].id}`, { scroll: false })
  }

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % articles.length
    setCurrentIndex(newIndex)
    setArticleData(articles[newIndex])
    router.push(`/admin/articles/${articles[newIndex].id}`, { scroll: false })
  }

  if (!articleData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrevious} disabled={articles.length <= 1}><ChevronLeft /></Button>
        <Button onClick={handleNext} disabled={articles.length <= 1}><ChevronRight /></Button>
      </div>
      <ArticlePreview article={articleData} />
      <div className="mt-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Review Article</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Review Article</DialogTitle>
              <DialogDescription>
                Approve or reject the article "{articleData.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="Add a comment (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleApproval(false)} disabled={isLoading}>
                Reject
              </Button>
              <Button onClick={() => handleApproval(true)} disabled={isLoading}>
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

