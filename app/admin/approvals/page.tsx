import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PendingArticle } from '@/types/article'
import { Pagination } from '@/components/pagination'
import { prisma } from '@/lib/prisma'
import { ApprovalFilter } from './approvals-filter'


export default async function ApprovalsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)
  const pageSize = 6

  if (!session || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
    redirect('/admin')
  }

  const page = parseInt(searchParams.page as string || '1')

  //  const pendingArticles = await prisma.article.findMany({
  //    where: { status: 'PENDING' },
  //    take: pageSize,
  //    skip: (page - 1) * pageSize,
  //    orderBy: { createdAt: 'desc' },
  //    include: { author: true, category: true }
  //  })

  //  const totalArticles = await prisma.article.count({
  //    where: { status: 'PENDING' }
  //  })
  const dateType = (searchParams.dateType as 'created' | 'updated') || 'created'
  const sortField = dateType === 'updated' ? 'updatedAt' : 'createdAt'
  const where: any = {status: 'PENDING'}; 
  if (searchParams.category) where.categoryId = searchParams.category as string 
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
  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search as string, mode: 'insensitive' } },
      { content: { contains: searchParams.search as string, mode: 'insensitive' } }
    ]
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
   <div className="space-y-6">
     <h1 className="text-3xl font-bold">Article Approvals</h1>
     <ApprovalFilter />
     <DataTable columns={columns} data={articles as PendingArticle[]} />
     {totalPages > 1 && (
       <Pagination
         currentPage={page}
         totalPages={totalPages}
         basePath="/admin/approvals"
       />
     )}
   </div>
 )
}

