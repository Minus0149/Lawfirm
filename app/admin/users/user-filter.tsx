'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Role } from "@prisma/client"
import { ScrollArea } from "@/components/ui/scroll-area"

export function UserFilter() { // Ensure component is exported
  const router = useRouter()
  const searchParams = useSearchParams()
  const [role, setRole] = useState(searchParams.get('role') || 'ALL')
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (role && role !== 'ALL') params.set('role', role)
    else params.delete('role')
    if (searchTerm) params.set('search', searchTerm)
    else params.delete('search')
    router.push(`/admin/users?${params.toString()}`)
  }

  return (
    <ScrollArea className="h-[235px] w-full rounded-md border p-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              {Object.values(Role).map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email"
          />
        </div>
        <Button onClick={handleFilter}>Apply Filter</Button>
      </div>
    </ScrollArea>
  )
}

