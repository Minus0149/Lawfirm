import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ActivityLog } from '@/types/activityLog'
import { ActivityLogFilter } from './activity-log-filter'
import { Pagination } from '@/components/pagination'

export default async function ActivityLogPage({ 
 searchParams 
}: { 
 searchParams: { [key: string]: string | string[] | undefined }
}) {
 const session = await getServerSession(authOptions)

 if (!session || session.user.role !== 'SUPER_ADMIN') {
   redirect('/admin')
 }

 const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
 const limit = 20
 const skip = (page - 1) * limit

 const where: any = {}
 if (searchParams.action) where.action = searchParams.action as string
 if (searchParams.userId) where.userId = searchParams.userId as string
 if (searchParams.from || searchParams.to) {
   where.createdAt = {}
   if (searchParams.from) where.createdAt.gte = new Date(searchParams.from as string)
   if (searchParams.to) where.createdAt.lte = new Date(searchParams.to as string)
 }

 try {
   const [activityLogs, totalLogs] = await Promise.all([
     prisma.activityLog.findMany({
       where,
       orderBy: { createdAt: 'desc' },
       skip,
       take: limit,
       include: { 
         user: true
       }
     }),
     prisma.activityLog.count({ where })
   ])

   // Handle cases where user might be null
   const formattedLogs = activityLogs.map(log => ({
     ...log,
     user: log.user || { name: 'Deleted User', email: 'N/A' }
   }))

   const totalPages = Math.ceil(totalLogs / limit)

   // Fetch unique actions and users for filter dropdowns
   const [uniqueActions, uniqueUsers] = await Promise.all([
     prisma.activityLog.groupBy({
       by: ['action'],
       orderBy: { action: 'asc' },
     }),
     prisma.user.findMany({
       select: { id: true, name: true, email: true },
       orderBy: { name: 'asc' },
     })
   ])

   const actionOptions = uniqueActions.map(a => ({ value: a.action, label: a.action }))
   const userOptions = uniqueUsers.map(u => ({ value: u.id, label: u.name || u.email }))

   return (
     <div className="space-y-6">
       <h1 className="text-2xl font-bold">Activity Log</h1>
       <ActivityLogFilter actions={actionOptions} users={userOptions} />
       <div className="overflow-x-auto">
         <DataTable columns={columns} data={formattedLogs} />
       </div>
       {totalPages > 1 && (
         <Pagination
           currentPage={page}
           totalPages={totalPages}
           basePath="/admin/activity-log"
         />
       )}
     </div>
   )
 } catch (error) {
   console.error('Error fetching activity logs:', error)
   return <div>Error loading activity logs. Please try again later.</div>
 }
}

