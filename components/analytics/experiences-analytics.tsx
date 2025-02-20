"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Pagination } from "@/components/pagination"
import { useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function ExperiencesAnalytics() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/analytics/experiences?${searchParams.toString()}&page=${page}&limit=${pageSize}`,
        )
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching experiences analytics:", error)
        toast({
          title: "Error",
          description: "Failed to fetch experiences analytics",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams, page])

  if (loading || !data) {
    return <div>Loading...</div>
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

  const columns = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "company", header: "Company" },
    { accessorKey: "author.name", header: "Author" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "views", header: "Views" },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }: any) => new Date(row.original.createdAt).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Experiences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalExperiences}</div>
            <p className="text-xs text-muted-foreground">+{data.newExperiences} new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.approvedCount}</div>
            <p className="text-xs text-muted-foreground">{data.approvalRate}% approval rate</p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalViews}</div>
            <p className="text-xs text-muted-foreground">{data.averageViews} avg. views per experience</p>
          </CardContent>
        </Card> */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.uniqueContributors}</div>
            <p className="text-xs text-muted-foreground">Unique authors</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submission Trends</CardTitle>
            <CardDescription>New experiences over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.submissionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="submissions" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Experience status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.statusDistribution}
                    dataKey="value"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {data.statusDistribution.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Experience Details</CardTitle>
          <CardDescription>Detailed metrics for each experience</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data.experiences} />
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(data.totalExperiences / pageSize)}
              basePath="/admin/analytics"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

