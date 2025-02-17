'use server'

import { cookies } from 'next/headers'
import { incrementArticleViews } from '@/lib/article-utils'

export async function viewArticle(articleId: string) {
  const viewedArticles = JSON.parse(cookies().get('viewedArticles')?.value || '[]')

  if (!viewedArticles.includes(articleId)) {
    await incrementArticleViews(articleId)
    viewedArticles.push(articleId)
    cookies().set('viewedArticles', JSON.stringify(viewedArticles), { maxAge: 60 * 60 * 24 }) // 24 hours
  }
}

