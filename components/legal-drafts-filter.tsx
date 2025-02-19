"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"

export function LegalDraftsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    return startDate && endDate ? { from: new Date(startDate), to: new Date(endDate) } : undefined
  })
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm) params.set("search", searchTerm)
    else params.delete("search")
    if (category) params.set("category", category)
    else params.delete("category")
    if (dateRange?.from) params.set("startDate", dateRange.from.toISOString().split("T")[0])
    else params.delete("startDate")
    if (dateRange?.to) params.set("endDate", dateRange.to.toISOString().split("T")[0])
    else params.delete("endDate")
    router.push(`/admin/legal-drafts?${params.toString()}`)
  }

  return (
    <div className="space-y-4 bg-card p-4 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search legal drafts..."
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="agreement">Agreement</SelectItem>
              <SelectItem value="motion">Motion</SelectItem>
              <SelectItem value="pleading">Pleading</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* <div>
          <Label>Date Range</Label>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div> */}
      </div>
      <Button onClick={handleFilter}>Apply Filter</Button>
    </div>
  )
}

