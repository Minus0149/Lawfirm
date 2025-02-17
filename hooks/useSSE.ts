import { useState, useEffect } from 'react'
import { Article} from '@/types/article'
import { User} from '@/types/user'
import { Advertisement} from '@/types/advertisement'
import { ActivityLog} from '@/types/activityLog'
import { Reel} from '@/types/reel'

type SSEData = {
  type: 'articles' | 'users' | 'advertisements' | 'activityLogs' | 'reels'
  data: any
}

export function useSSE() {
  const [articles, setArticles] = useState<Article[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [reels, setReels] = useState<Reel[]>([])

  useEffect(() => {
    const eventSource = new EventSource('/api/sse')

    eventSource.onmessage = (event) => {
      try {
        const parsedData: SSEData = JSON.parse(event.data)
        switch (parsedData.type) {
          case 'articles':
            setArticles(parsedData.data)
            break
          case 'users':
            setUsers(parsedData.data)
            break
          case 'advertisements':
            setAdvertisements(parsedData.data)
            break
          case 'activityLogs':
            setActivityLogs(parsedData.data)
            break
          case 'reels':
            setReels(parsedData.data)
            break
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return { articles, users, advertisements, activityLogs, reels }
}

