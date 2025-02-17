import { prisma } from '@/lib/prisma'

const isServer = typeof window === 'undefined'

function getBaseUrl() {
  if (isServer) {
    // Server-side: use the NEXT_PUBLIC_APP_URL environment variable
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }
  // Client-side: use the current origin
  return window.location.origin
}

export async function incrementArticleViews(articleId: string) {
  if (isServer) {
    // If on the server, use Prisma directly
    await prisma.article.update({
      where: { id: articleId },
      data: { views: { increment: 1 } },
    })
  } else {
    // If on the client, use the API route
    try {
      const response = await fetch(`${getBaseUrl()}/api/articles/${articleId}/view`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to increment article views')
      }
      const data = await response.json()
      return data.views
    } catch (error) {
      console.error('Error incrementing article views:', error)
    }
  }
}

export async function likeArticle(articleId: string) {
  if (isServer) {
    const article = await prisma.article.update({
      where: { id: articleId },
      data: { likes: { increment: 1 } },
    })
    return article.likes
  } else {
    try {
      const response = await fetch(`${getBaseUrl()}/api/articles/${articleId}/like`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to like article')
      }
      const data = await response.json()
      return data.likes
    } catch (error) {
      console.error('Error liking article:', error)
      throw error
    }
  }
}

export async function unlikeArticle(articleId: string) {
  if (isServer) {
    const article = await prisma.article.update({
      where: { id: articleId },
      data: { likes: { decrement: 1 } },
    })
    return article.likes
  } else {
    try {
      const response = await fetch(`${getBaseUrl()}/api/articles/${articleId}/unlike`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to unlike article')
      }
      const data = await response.json()
      return data.likes
    } catch (error) {
      console.error('Error unliking article:', error)
      throw error
    }
  }
}

export async function shareArticle(articleId: string) {
  if (isServer) {
    const article = await prisma.article.update({
      where: { id: articleId },
      data: { shares: { increment: 1 } },
    })
    return article.shares
  } else {
    try {
      const response = await fetch(`${getBaseUrl()}/api/articles/${articleId}/share`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to share article')
      }
      const data = await response.json()
      return data.shares
    } catch (error) {
      console.error('Error sharing article:', error)
      throw error
    }
  }
}

