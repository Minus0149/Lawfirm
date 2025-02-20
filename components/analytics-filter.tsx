"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { DateRange } from "react-day-picker"

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
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="law-notes">Law Notes</SelectItem>
                <SelectItem value="case-briefs">Case Briefs</SelectItem>
                <SelectItem value="legal-articles">Legal Articles</SelectItem>
                <SelectItem value="exam-materials">Exam Materials</SelectItem>
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
                <SelectItem value="IN_ARTICLE">In Article</SelectItem>
                <SelectItem value="SIDEBAR">Sidebar</SelectItem>
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

