import { Article } from '@/types/article'
import { User } from '@/types/user'
import { Advertisement } from '@/types/advertisement'
import { ActivityLog } from '@/types/activityLog'


export interface SSEArticleData {
  type: 'articles' | 'newArticle' | 'articleUpdated'
  articles?: Article[]
  article?: Article
}

export interface SSEUserData {
  type: 'users'
  users: User[]
}

export interface SSEAdvertisementData {
  type: 'advertisements'
  advertisements: Advertisement[]
}

export interface SSEActivityLogData {
  type: 'activityLogs'
  activityLogs: ActivityLog[]
}

export type SSEData = 
  | SSEArticleData 
  | SSEUserData 
  | SSEAdvertisementData 
  | SSEActivityLogData

