"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { PendingArticle } from '@/types/article'
import { useRouter } from 'next/navigation'

export function ApprovalDialog({ article }: { article: PendingArticle }) {
  const [isOpen, setIsOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleApproval = async (approved: boolean) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/articles/${article.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, comment }),
      })

      if (!response.ok) {
        throw new Error('Failed to update article status')
      }

      toast({
        title: approved ? "Article Approved" : "Article Rejected",
        description: `The article "${article.title}" has been ${approved ? 'approved' : 'rejected'}.`,
      })

      setIsOpen(false)
      router.refresh()
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review Article</DialogTitle>
          <DialogDescription>
            Approve or reject the article "{article.title}"
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
  )
}

