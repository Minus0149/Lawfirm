'use client'

import { useState, useEffect } from 'react'
import { ActivityLog } from '@/types/activityLog'
import { SSEData } from '@/types/sse'
import { formatDate } from '@/lib/formatDate'

interface ActivityLogListProps {
  initialLogs: ActivityLog[]
}

export function ActivityLogList({ initialLogs }: ActivityLogListProps) {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs)

  useEffect(() => {
    const eventSource = new EventSource('/api/sse')

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SSEData
        if (data.type === 'activityLogs' && data.activityLogs) {
          setLogs(data.activityLogs)
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

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="bg-card text-card-foreground p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{log.user.name || log.user.email}</p>
              <p className="text-sm text-muted-foreground">{log.action}</p>
            </div>
            <p className="text-sm text-muted-foreground">{formatDate(new Date(log.createdAt))}</p>
          </div>
          {log.details && <p className="mt-2 text-sm">{log.details}</p>}
        </div>
      ))}
    </div>
  )
}

