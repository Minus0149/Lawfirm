'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"

export function AdvertisementFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [placement, setPlacement] = useState<string | undefined>(searchParams.get('placement') || undefined)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    return startDate && endDate ? { from: new Date(startDate), to: new Date(endDate) } : undefined
  })

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (placement && placement !== 'ALL') params.set('placement', placement)
    else params.delete('placement')
    if (dateRange?.from) params.set('startDate', dateRange.from.toISOString().split('T')[0])
    else params.delete('startDate')
    if (dateRange?.to) params.set('endDate', dateRange.to.toISOString().split('T')[0])
    else params.delete('endDate')
    router.push(`/admin/advertisements?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="w-full sm:w-auto">
          <Label htmlFor="placement">Placement</Label>
          <Select value={placement || undefined} onValueChange={setPlacement}>
            <SelectTrigger id="placement">
              <SelectValue placeholder="Select placement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Placements</SelectItem>
              <SelectItem value="SIDEBAR">Sidebar</SelectItem>
              <SelectItem value="TOP_BANNER">Top Banner</SelectItem>
              <SelectItem value="IN_ARTICLE">In Article</SelectItem>
              <SelectItem value="FOOTER">Footer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto">
          <Label>Date Range</Label>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </div>
      <Button onClick={handleFilter}>Apply Filter</Button>
    </div>
  )
}

