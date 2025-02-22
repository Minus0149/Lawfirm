"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Pagination } from "../pagination"

interface AdAnalytics {
  id: string
  title: string
  placement: string
  location: string
  category: string
  views: number
  clicks: number
  ctr: number
  startDate: string
  endDate: string
}

export function AdvertisementsAnalytics() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<AdAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [performanceByLocation, setPerformanceByLocation] = useState<any[]>([])
  const [performanceByCategory, setPerformanceByCategory] = useState<any[]>([])
  const [totalAds, setTotalAds] = useState(0)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/analytics/advertisements?${searchParams.toString()}&page=${page}&limit=${pageSize}`)
        const result = await response.json()
        setData(result.advertisements)
        setPerformanceByLocation(result.performanceByLocation)
        setPerformanceByCategory(result.performanceByCategory)
        setTotalAds(result.totalAds)
      } catch (error) {
        console.error("Error fetching advertisement analytics:", error)
        toast.error("Failed to fetch analytics data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "placement",
      header: "Placement",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "views",
      header: "Views",
    },
    {
      accessorKey: "clicks",
      header: "Clicks",
    },
    {
      accessorKey: "ctr",
      header: "CTR",
      cell: ({ row }: { row: { original: AdAnalytics } }) => `${(row.original.ctr * 100).toFixed(2)}%`,
    },
  ]

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
            <CardDescription>Across all ads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.reduce((sum, ad) => sum + ad.views, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
            <CardDescription>Across all ads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.reduce((sum, ad) => sum + ad.clicks, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average CTR</CardTitle>
            <CardDescription>Click-through rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                (data.reduce((sum, ad) => sum + ad.clicks, 0) / data.reduce((sum, ad) => sum + ad.views, 0)) *
                100
              ).toFixed(2)}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceByLocation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" name="Views" />
                <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" name="Views" />
                <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advertisements Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
          <div className="mt-4">
            <Pagination
              totalPages={Math.ceil(totalAds / pageSize)}
              currentPage={page}
              basePath="/admin/analytics"
            />
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

