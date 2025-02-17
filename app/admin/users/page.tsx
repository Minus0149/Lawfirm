import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { User } from '@/types/user'
import { UserFilter } from './user-filter'
import { Pagination } from '@/components/pagination'

export default async function UsersPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)

  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    redirect('/admin')
  }

  // Filter users based on search params
  const where: any = {
    ...(searchParams.role ? { role: searchParams.role } : {}),
    ...(searchParams.search ? {
      OR: [
        { name: { contains: searchParams.search, mode: 'insensitive' } },
        { email: { contains: searchParams.search, mode: 'insensitive' } },
      ],
    } : {}),
  }

  const users = await prisma.user.findMany({
    where,
    select: { id: true, name: true, email: true, role: true, imageFile: true }
  })

  const page = parseInt(searchParams.page as string || '1')
  const pageSize = 10 // Adjust this value as needed
  const totalPages = Math.ceil(users.length / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
        <Link href="/admin/users/new">
          <Button>Create New User</Button>
        </Link>
      </div>
      <UserFilter />
      <DataTable columns={columns} data={users.slice((page - 1) * pageSize, page * pageSize)} />
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/admin/users"
        />
      )}
    </div>
  )
}

