'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from '@/components/ui/data-table'
import { Article } from '@/types/article'
import { Advertisement } from '@/types/advertisement'
import { toast } from '@/components/ui/use-toast'
import { Pagination } from '@/components/pagination'
import { formatDate } from '@/lib/formatDate';
import Image from 'next/image'


interface AnalyticsArticle {
 id: string;
 title: string;
 author: {
   name: string | null;
 };
 category: string;
 createdAt: Date;
 updatedAt: Date;
 views: number;
 likes: number;
 shares: number;
}

interface AnalyticsAdvertisement {
 id: string;
 image: string | null;
 imageFile: Buffer | null;
 link: string;
 placement: string;
 startDate: Date;
 endDate: Date;
 views: number;
 clicks: number;
}

export default function AnalyticsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [articlesLoading, setArticlesLoading] = useState(true)
  const [advertisementsLoading, setAdvertisementsLoading] = useState(true)
  const [overviewLoading, setOverviewLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [articlesPage, setArticlesPage] = useState(1)
  const [advertisementsPage, setAdvertisementsPage] = useState(1)
  const articlesPageSize = 10
  const advertisementsPageSize = 10

  const [totalArticles, setTotalArticles] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAds, setTotalAds] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  const fetchOverviewData = async () => {
    setOverviewLoading(true)
    try {
      const [totalUsersData, totalViewsData] = await Promise.all([
        fetch('/api/users/count').then(res => res.json()),
        fetch('/api/articles/views').then(res => res.json())
      ])
      setTotalUsers(totalUsersData.count)
      setTotalViews(totalViewsData.totalViews)
    } catch (error) {
      console.error('Error fetching overview data:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch overview data.',
        variant: 'destructive'
      })
    } finally {
      setOverviewLoading(false)
    }
  }

  const fetchArticlesData = async (page: number) => {
    setArticlesLoading(true)
    try {
      const response = await fetch(`/api/articles?page=${page}&limit=${articlesPageSize}`)
      const data = await response.json()
      setArticles(data.articles)
      setTotalArticles(data.totalArticles)
    } catch (error) {
      console.error('Error fetching articles data:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch articles data.',
        variant: 'destructive'
      })
    } finally {
      setArticlesLoading(false)
    }
  }

  const fetchAdvertisementsData = async (page: number) => {
    setAdvertisementsLoading(true)
    try {
      const response = await fetch(`/api/advertisements?page=${page}&limit=${advertisementsPageSize}`)
      const data = await response.json()
      setAdvertisements(data.ads)
      setTotalAds(data.total)
    } catch (error) {
      console.error('Error fetching advertisements data:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch advertisements data.',
        variant: 'destructive'
      })
    } finally {
      setAdvertisementsLoading(false)
    }
  }

  useEffect(() => {
    fetchOverviewData()
    fetchArticlesData(articlesPage)
    fetchAdvertisementsData(advertisementsPage)
  }, [articlesPage, advertisementsPage])

  const articleColumns: any[] = [
    {
      header: "Title",
      accessorKey: "title"
    },
    {
      header: "Author",
      accessorKey: "author.name",
      cell: ({ row }: { row: any }) => row.original.author?.name || "Unknown",
    },
    {
      header: "Category",
      accessorKey: "category"
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }: { row: any }) => formatDate(new Date(row.original.createdAt)),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: ({ row }: { row: any }) => formatDate(new Date(row.original.updatedAt)),
    },
    {
      header: "Views",
      accessorKey: "views"
    },
    {
      header: "Likes",
      accessorKey: "likes"
    },
    {
      header: "Shares",
      accessorKey: "shares"
    },
  ]

  const advertisementColumns: any[] = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }: { row: any }) => (
        row.original.image || row.original.imageFile ? (
          <div className="relative w-16 h-16">
            <Image
              src={row.original.image || `data:image/jpeg;base64,${row.original.imageFile?.toString('base64')}`}
              alt="Ad"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
        ) : (
          <span>No image</span>
        )
      ),
    },
    {
      accessorKey: "link",
      header: "Link",
      cell: ({ row }: { row: any }) => (
        <a href={row.original.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {row.original.link}
        </a>
      ),
    },
    {
      accessorKey: "placement",
      header: "Placement",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }: { row: any }) => formatDate(row.original.startDate),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }: { row: any }) => formatDate(row.original.endDate),
    },
    {
      accessorKey: "views",
      header: "Views",
    },
    {
      accessorKey: "clicks",
      header: "Clicks",
    },
  ]
 


  if (overviewLoading) {
    return <div>Loading...</div>
  }

  const handleArticlesPageChange = (page: number) => {
    setArticlesPage(page)
  }

  const handleAdvertisementsPageChange = (page: number) => {
    setAdvertisementsPage(page)
  }

  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="articles">Articles</TabsTrigger>
        <TabsTrigger value="advertisements">Advertisements</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalArticles}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Ads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAds}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="articles">
        {articlesLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <DataTable columns={articleColumns} data={articles.map(article => ({
              id: article.id,
              title: article.title,
              author: article.author,
              category: article.category.name,
              createdAt: article.createdAt,
              updatedAt: article.updatedAt,
              views: article.views,
              likes: article.likes,
              shares: article.shares,
            }))} />
            <Pagination
              currentPage={articlesPage}
              totalPages={Math.ceil(totalArticles / articlesPageSize)}
              basePath="/admin/analytics"
            />
          </>
        )}
      </TabsContent>
      <TabsContent value="advertisements">
        {advertisementsLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <DataTable columns={advertisementColumns} data={advertisements.map(ad => ({
              id: ad.id,
              image: ad.image,
              imageFile: ad.imageFile,
              url: ad.link,
              placement: ad.placement,
              startDate: ad.startDate,
              endDate: ad.endDate,
              views: ad.views,
              clicks: ad.clicks,
            }))} />
            <Pagination
              currentPage={advertisementsPage}
              totalPages={Math.ceil(totalAds / advertisementsPageSize)}
              basePath="/admin/analytics"
            />
          </>
        )}
      </TabsContent>
    </Tabs>
  )
}

