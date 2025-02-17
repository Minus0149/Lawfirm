import { Category, Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { ArticleWhereInput, Article } from "@/types/article"
import { createCache } from "@/lib/utils"

const articleCache = createCache<{ articles: Article[], totalArticles: number }>(100) // Cache up to 100 queries

export async function fetchArticles(
  page: number,
  pageSize: number,
  category?: Category,
  additionalWhere?: ArticleWhereInput
): Promise<{ articles: Article[], totalArticles: number }> {
  const cacheKey = `articles_${page}_${pageSize}_${category || 'all'}_${JSON.stringify(additionalWhere)}`
  const cachedResult = articleCache.get(cacheKey)

  if (cachedResult) {
    return cachedResult
  }

  const where: ArticleWhereInput = {
    status: 'PUBLISHED',
    ...additionalWhere,
  }

  if (category) {
    where.category = category
  }

  try {
    const [articles, totalArticles] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { author: { select: { id: true, name: true, role: true } }, category: true },
      }),
      prisma.article.count({ where })
    ])

    const formattedArticles: Article[] = articles.map((article) => ({
      ...article,
      imageFile: article.imageFile && typeof article.imageFile === 'object' && (article.imageFile as any) instanceof Buffer 
        ? (article.imageFile as Buffer).toString('base64')
        : article.imageFile,
      author: article.author || null,
    }))

    const result = { articles: formattedArticles, totalArticles }
    articleCache.set(cacheKey, result)
    return result
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw new Error('Failed to fetch articles')
  }
}

export async function fetchTrendingArticles(): Promise<Article[]> {
  const cacheKey = 'trending_articles'
  const cachedResult = articleCache.get(cacheKey)

  if (cachedResult) {
    return cachedResult.articles
  }

  try {
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },
      orderBy: {
        views: 'desc'
      },
      take: 3,
      include: { author: { select: { name: true, id: true, role: true } } , category: true },
    })

    const formattedArticles: Article[] = articles.map((article) => ({
      ...article,
      imageFile: article.imageFile && typeof article.imageFile === 'object' && (article.imageFile as any) instanceof Buffer 
        ? (article.imageFile as Buffer).toString('base64')
        : article.imageFile,
      author: article.author || null,
    }))

    articleCache.set(cacheKey, { articles: formattedArticles, totalArticles: formattedArticles.length })
    return formattedArticles
  } catch (error) {
    console.error('Error fetching trending articles:', error)
    throw new Error('Failed to fetch trending articles')
  }
}

export async function fetchSearchedArticles(
  query: string,
  page: number,
  pageSize: number
): Promise<{ articles: Article[], totalArticles: number }> {
  const cacheKey = `search_${query}_${page}_${pageSize}`
  const cachedResult = articleCache.get(cacheKey)

  if (cachedResult) {
    return cachedResult
  }

  try {
    const [articles, totalArticles] = await Promise.all([
      prisma.article.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
          status: 'PUBLISHED'
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { author: { select: { id: true, name: true, role: true } }, category: true },
      }),
      prisma.article.count({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
          status: 'PUBLISHED'
        }
      })
    ])

    const formattedArticles: Article[] = articles.map((article) => ({
      ...article,
      imageFile: article.imageFile && typeof article.imageFile === 'object' && (article.imageFile as any) instanceof Buffer 
      ? (article.imageFile as Buffer).toString('base64')
      : article.imageFile,
      author: article.author || null,
    }))

    const result = { articles: formattedArticles, totalArticles }
    articleCache.set(cacheKey, result)
    return result
  } catch (error) {
    console.error('Error fetching searched articles:', error)
    throw new Error('Failed to fetch searched articles')
  }
}