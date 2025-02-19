"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"
import { Card, CardContent } from "@/components/ui/card"

export function AnalyticsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    return startDate && endDate ? { from: new Date(startDate), to: new Date(endDate) } : undefined
  })
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [dataType, setDataType] = useState(searchParams.get("dataType") || "all")

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm) params.set("search", searchTerm)
    else params.delete("search")
    if (dataType !== "all") params.set("dataType", dataType)
    else params.delete("dataType")
    if (dateRange?.from) params.set("startDate", dateRange.from.toISOString().split("T")[0])
    else params.delete("startDate")
    if (dateRange?.to) params.set("endDate", dateRange.to.toISOString().split("T")[0])
    else params.delete("endDate")
    router.push(`/admin/analytics?${params.toString()}`)
  }, [searchTerm, dataType, dateRange, router, searchParams])

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <Label htmlFor="dataType">Data Type</Label>
            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger id="dataType">
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="articles">Articles</SelectItem>
                <SelectItem value="advertisements">Advertisements</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Date Range</Label>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

