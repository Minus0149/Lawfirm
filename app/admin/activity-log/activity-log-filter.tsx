
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"

interface FilterOption {
  value: string
  label: string
}

interface ActivityLogFilterProps {
  actions: FilterOption[]
  users: FilterOption[]
}

export function ActivityLogFilter({ actions, users }: ActivityLogFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [action, setAction] = useState(searchParams.get('action') || 'ALL')
  const [userId, setUserId] = useState(searchParams.get('userId') || 'ALL')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    return from && to ? { from: new Date(from), to: new Date(to) } : undefined
  })

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (action && action !== 'ALL') params.set('action', action)
    else params.delete('action')
    if (userId && userId !== 'ALL') params.set('userId', userId)
    else params.delete('userId')
    if (dateRange?.from) params.set('from', dateRange.from.toISOString().split('T')[0])
    else params.delete('from')
    if (dateRange?.to) params.set('to', dateRange.to.toISOString().split('T')[0])
    else params.delete('to')
    router.push(`/admin/activity-log?${params.toString()}`)
  }

  const handleQuickDateSelect = (days: number) => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - days + 1)
    setDateRange({ from, to })
  }

  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-wrap gap-4">
        <div className="w-full sm:w-48">
          <Label htmlFor="action">Action</Label>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger id="action">
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Actions</SelectItem>
              {actions.map((action) => (
                <SelectItem key={action.value} value={action.value}>
                  {action.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Label htmlFor="userId">User</Label>
          <Select value={userId} onValueChange={setUserId}>
            <SelectTrigger id="userId">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Users</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.value} value={user.value}>
                  {user.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto">
          <Label>Date Range</Label>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => handleQuickDateSelect(1)}>Last 24 Hours</Button>
        <Button onClick={() => handleQuickDateSelect(7)}>Last 7 Days</Button>
        <Button onClick={() => handleQuickDateSelect(30)}>Last 30 Days</Button>
        <Button onClick={handleFilter} variant="default">Apply Filter</Button>
      </div>
    </div>
  )
}