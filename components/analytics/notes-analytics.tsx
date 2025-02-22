"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Pagination } from "@/components/pagination"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export function NotesAnalytics() {
  const searchParams = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/analytics/notes?${searchParams.toString()}&page=${currentPage}&limit=${pageSize}`,
        )
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching notes analytics:", error)
        toast.error("Failed to fetch analytics data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams, currentPage])

  if (loading || !data) {
    return <div>Loading...</div>
  }

  const columns = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "category.name", header: "Category" },
    { accessorKey: "author.name", header: "Author" },
    { accessorKey: "downloads", header: "Downloads" },
    { accessorKey: "views", header: "Views" },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }: any) => new Date(row.original.createdAt).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalNotes}</div>
            <p className="text-xs text-muted-foreground">+{data.newNotes} new notes this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalDownloads}</div>
            <p className="text-xs text-muted-foreground">+{data.downloadGrowth}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageDownloads}</div>
            <p className="text-xs text-muted-foreground">Per note</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.popularCategory}</div>
            <p className="text-xs text-muted-foreground">Most downloaded category</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Download Trends</CardTitle>
            <CardDescription>Downloads over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.downloadTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="downloads" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Downloads by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categoryPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="downloads" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notes Performance</CardTitle>
          <CardDescription>Detailed performance metrics for each note</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data.notes} />
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(data.totalNotes / pageSize)}
              basePath="/admin/analytics"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

