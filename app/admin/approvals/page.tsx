import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PendingArticle } from '@/types/article'
import { Pagination } from '@/components/pagination'
import { prisma } from '@/lib/prisma'


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

 const pendingArticles = await prisma.article.findMany({
   where: { status: 'PENDING' },
   take: pageSize,
   skip: (page - 1) * pageSize,
   orderBy: { createdAt: 'desc' },
   include: { author: true, category: true }
 })

 const totalArticles = await prisma.article.count({
   where: { status: 'PENDING' }
 })

 const totalPages = Math.ceil(totalArticles / pageSize)

 return (
   <div className="space-y-6">
     <h1 className="text-3xl font-bold">Article Approvals</h1>
     <DataTable columns={columns} data={pendingArticles as PendingArticle[]} />
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

