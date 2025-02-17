import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ArticleTable } from './article-table'
import { ArticleFilter } from './article-filter'
import { prisma } from '@/lib/prisma'
import { Article } from '@/types/article'
import { Pagination } from '@/components/pagination'

export default async function ArticleList({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MANAGER'].includes(session.user.role as string)) {
    redirect('/')
  }

  const page = parseInt(searchParams.page as string || '1')
  const pageSize = 10

  const dateType = (searchParams.dateType as 'created' | 'updated') || 'created'
  const sortField = dateType === 'updated' ? 'updatedAt' : 'createdAt'

  const where: any = {}
  if (searchParams.category) where.category = { name: searchParams.category as string }
  if (searchParams.status) where.status = searchParams.status as string
  if (searchParams.userId) where.authorId = searchParams.userId
  if (searchParams.role) where.author = { role: searchParams.role as string }
  if (searchParams.startDate || searchParams.endDate) {
    where[sortField] = {}
    if (searchParams.startDate) where[sortField].gte = new Date(searchParams.startDate as string)
    if (searchParams.endDate) {
      const endDate = new Date(searchParams.endDate as string)
      endDate.setHours(23, 59, 59, 999)
      where[sortField].lte = endDate
    }
  }

  const [articles, totalArticles] = await Promise.all([
    prisma.article.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { [sortField]: 'desc' }, // Updated sort order
      include: { author: { select: { id: true, name: true, role: true } }, category: true }
    }),
    prisma.article.count({ where })
  ])

  const totalPages = Math.ceil(totalArticles / pageSize)

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link href="/admin/articles/new">
          <Button>Create New Article</Button>
        </Link>
      </div>
      <ArticleFilter />
      <div className="overflow-hidden">
        <ArticleTable articles={articles as Article[]} dateType={dateType} sortField={sortField} />
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/admin/articles"
        />
      )}
    </div>
  )
}

