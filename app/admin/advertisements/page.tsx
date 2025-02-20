import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { Advertisement } from '@prisma/client'
import { AdvertisementFilter } from './advertisement-filter'
import { Pagination } from '@/components/pagination'

export default async function AdvertisementsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    redirect('/admin')
  }

  const page = parseInt(searchParams.page as string || '1')
  const limit = parseInt(searchParams.limit as string || '10')
  const placement = searchParams.placement as string | undefined
  const startDate = searchParams.startDate as string | undefined
  const endDate = searchParams.endDate as string | undefined
  const location = searchParams.location || undefined as string | undefined
  const category = searchParams.category || undefined as string | undefined

  const where: any = {}
  if (placement && placement !== 'all') where.placement = placement
  if (location && location !== 'all') where.location = location
  if (category && category !== 'all') where.category = category
  if (startDate) where.startDate = { gte: new Date(startDate) }
  if (endDate) where.endDate = { lte: new Date(endDate) }
  

  const [ads, total] = await Promise.all([
    prisma.advertisement.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {category: true}
    }),
    prisma.advertisement.count({ where })
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
        <h1 className="text-2xl font-bold">Advertisements</h1>
        <Link href="/admin/advertisements/new">
          <Button>Create New Advertisement</Button>
        </Link>
      </div>
      <AdvertisementFilter />
      <div className="overflow-hidden">
        <DataTable columns={columns} data={ads} />
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/admin/advertisements"/>
        </div>
      )}
    </div>
  )
}

