"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Pagination } from "../pagination"
import { formatDate } from "@/lib/formatDate"

interface ArticleAnalytics {
  id: string
  title: string
  views: number
  likes: number
  shares: number
  category: { name: string }
  author: { name: string }
  createdAt: string
}

export function ArticlesAnalytics() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<ArticleAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [viewsOverTime, setViewsOverTime] = useState<any[]>([])  
  const [totalArticles, setTotalArticles] = useState(0)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/analytics/articles?${searchParams.toString()}&page=${page}&limit=${pageSize}`)
        const result = await response.json()
        result.viewsOverTime = result.viewsOverTime.map((item: any) => ({ formatDate: formatDate(item.date), ...item }))
        setData(result.articles)
        setTotalArticles(result.totalArticles)
        setViewsOverTime(result.viewsOverTime)
      } catch (error) {
        console.error("Error fetching article analytics:", error)
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
      accessorKey: "category.name",
      header: "Category",
    },
    {
      accessorKey: "author.name",
      header: "Author",
    },
    {
      accessorKey: "views",
      header: "Views",
    },
    {
      accessorKey: "likes",
      header: "Likes",
    },
    {
      accessorKey: "shares",
      header: "Shares",
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
            <CardDescription>Across all articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.reduce((sum, article) => sum + article.views, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Likes</CardTitle>
            <CardDescription>Across all articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.reduce((sum, article) => sum + article.likes, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Shares</CardTitle>
            <CardDescription>Across all articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.reduce((sum, article) => sum + article.shares, 0)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Views Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formatDate"/>
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Articles Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
          <div className="mt-4">
            <Pagination
              totalPages={Math.ceil(totalArticles / pageSize)}
              currentPage={page}
              basePath="/admin/analytics"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

