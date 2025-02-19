import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Pagination } from "@/components/pagination"
import { ExperiencesFilter } from "@/components/experiences-filter"

const ITEMS_PER_PAGE = 10

export default async function AdminExperiencesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined
  const status = typeof searchParams.status === "string" ? searchParams.status : undefined

  const skip = (page - 1) * ITEMS_PER_PAGE
  const where: any = {}

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }
  if (status && status !== "all") where.status = status

  const [experiences, totalExperiences] = await Promise.all([
    prisma.experience.findMany({
      where,
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.experience.count({ where }),
  ])

  const totalPages = Math.ceil(totalExperiences / ITEMS_PER_PAGE)

  const filterFields = [
    { name: "search", label: "Search", type: "text" as const },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { value: "PENDING", label: "Pending" },
        { value: "APPROVED", label: "Approved" },
        { value: "REJECTED", label: "Rejected" },
      ],
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Experiences</h1>
        <Link href="/admin/experiences/new">
          <Button>Create New Experience</Button>
        </Link>
      </div>
      <ExperiencesFilter />
      <DataTable columns={columns} data={experiences} />
      <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/experiences" />
    </div>
  )
}

