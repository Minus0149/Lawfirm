import { prisma } from "@/lib/prisma"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnquiriesFilter } from "@/components/enquiries-filter"
import { Pagination } from "@/components/pagination"
import { EnquiryStatus } from "@/types/enquiry"

const ITEMS_PER_PAGE = 10

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const status = typeof searchParams.status === "string" ? searchParams.status : undefined
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined

  const where:{} = {
    ...(status && { status }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  }

  const skip = (page - 1) * ITEMS_PER_PAGE

  const [rawEnquiries, totalEnquiries, stats] = await Promise.all([
    prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.enquiry.count({ where }),
    prisma.enquiry.groupBy({
      by: ["status"],
      _count: true,
    }),
  ])

  const enquiries = rawEnquiries.map((enquiry) => ({
    ...enquiry,
    status: enquiry.status as EnquiryStatus,
    response: enquiry.response ?? undefined,
  }))

  const totalPages = Math.ceil(totalEnquiries / ITEMS_PER_PAGE)

  const statusCounts = {
    ACTIVE: 0,
    COMPLETE: 0,
    DENIED: 0,
    ...Object.fromEntries(stats.map((s) => [s.status, s._count])),
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Enquiries</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.ACTIVE}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.COMPLETE}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.DENIED}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Enquiries</CardTitle>
          <CardDescription>Manage and respond to user enquiries</CardDescription>
        </CardHeader>
        <CardContent>
          <EnquiriesFilter />
          <DataTable columns={columns} data={enquiries} />
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/admin/enquiries"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

