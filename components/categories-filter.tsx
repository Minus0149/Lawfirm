"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"
import { ScrollArea } from "./ui/scroll-area"

export function CategoriesFilter(categories: { name: string; id: string, parentId: string | null}[]) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    return startDate && endDate ? { from: new Date(startDate), to: new Date(endDate) } : undefined
  })
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [parentCategory, setParentCategory] = useState(searchParams.get("parentCategory") || "")

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm) params.set("search", searchTerm)
    else params.delete("search")
    if (parentCategory) params.set("parentCategory", parentCategory)
    else params.delete("parentCategory")
    if (dateRange?.from) params.set("startDate", dateRange.from.toISOString().split("T")[0])
    else params.delete("startDate")
    if (dateRange?.to) params.set("endDate", dateRange.to.toISOString().split("T")[0])
    else params.delete("endDate")
    router.push(`/admin/categories?${params.toString()}`)
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
            placeholder="Search categories..."
          />
        </div>
        <div>
          <Label htmlFor="parentCategory">Parent Category</Label>
          <Select value={parentCategory} onValueChange={setParentCategory}>
            <SelectTrigger id="parentCategory">
              <SelectValue placeholder="Select parent category" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
<SelectItem value="all_categories" className=' relative z-[70]'>All Categories</SelectItem>
{Object.values(categories).map((cat) => (
  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
))}
</ScrollArea>
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

