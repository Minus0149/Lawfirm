"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { DateRange } from "react-day-picker"
import { ScrollArea } from "./ui/scroll-area"

export function AnalyticsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    return startDate && endDate ? { from: new Date(startDate), to: new Date(endDate) } : undefined
  })
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [placement, setPlacement] = useState(searchParams.get("placement") || "")
  const [categories, setCategories] = useState<{ name: string; id: string }[]>([])

  useEffect(() => {
    const fetchCategories = async () => { 
      const response = await fetch('/api/categories')
      const data = await response.json()
      const flattenCategories = (categories: any[]): {name:string,id: string}[] => {
      return categories.reduce((acc: {name:string,id: string}[], category: any) => {
        acc.push({ name: category.name, id: category.id })
        if (category.children) {
        acc.push(...flattenCategories(category.children))
        }
        return acc
      }, [])
      }
      setCategories(flattenCategories(data))
    }
    
    fetchCategories()
  })

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (category) params.set("category", category)
    if (location) params.set("location", location)
    if (placement) params.set("placement", placement)
    if (dateRange?.from) params.set("startDate", dateRange.from.toISOString().split("T")[0])
    if (dateRange?.to) params.set("endDate", dateRange.to.toISOString().split("T")[0])
    router.push(`?${params.toString()}`)
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
              <ScrollArea className="h-[200px]">

                <SelectItem value="all" className=' relative z-[70]'>All Categories</SelectItem>
                {Object.values(categories).map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="HOME">Home Page</SelectItem>
                <SelectItem value="CATEGORY">Category Pages</SelectItem>
                <SelectItem value="ARTICLE">Article Pages</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="placement">Placement</Label>
            <Select value={placement} onValueChange={setPlacement}>
              <SelectTrigger id="placement">
                <SelectValue placeholder="Select placement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Placements</SelectItem>
                <SelectItem value="TOP_BANNER">Top Banner</SelectItem>
                {/* <SelectItem value="IN_ARTICLE">In Article</SelectItem> */}
                {/* <SelectItem value="SIDEBAR">Sidebar</SelectItem> */}
                <SelectItem value="CATEGORY_PAGE">Category Page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label>Date Range</Label>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={applyFilters}>Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  )
}

