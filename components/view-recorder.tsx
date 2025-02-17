'use client'

import { useEffect } from 'react'

interface ViewRecorderProps {
  articleId: string
}

export function ViewRecorder({ articleId }: ViewRecorderProps) {
  useEffect(() => {
    const recordView = async () => {
      try {
        await fetch(`/api/articles/${articleId}/view`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        console.error('Error recording view:', error)
      }
    }

    recordView()
  }, [articleId])

  return null
}

