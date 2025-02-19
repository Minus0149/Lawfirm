'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Status, Role } from "@prisma/client"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"

export function ApprovalFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [category, setCategory] = useState(searchParams.get('category') || 'all_categories')
  const [status, setStatus] = useState(searchParams.get('status') || 'all_statuses')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    return startDate && endDate ? { 
      from: new Date(startDate), 
      to: new Date(endDate)
    } : undefined
  })
  const [dateType, setDateType] = useState(searchParams.get('dateType') || 'created')
  const [users, setUsers] = useState<{ id: string; name: string }[]>([])
  const [selectedUser, setSelectedUser] = useState(searchParams.get('userId') || 'all_users')
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || 'all_roles')
  const [userSearch, setUserSearch] = useState('')
  const [categories, setCategories] = useState<{ name: string; id: string }[]>([])
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    }
    const fetchCategories = async () => { 
      const response = await fetch('/api/categories')
      const data = await response.json()
      console.log(data)
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
    fetchUsers()
    fetchCategories()
  }, [])

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(userSearch.toLowerCase())
  )

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (category && category !== 'all_categories') params.set('category', category)
    if (selectedUser && selectedUser !== 'all_users') params.set('userId', selectedUser)
    if (selectedRole && selectedRole !== 'all_roles') params.set('role', selectedRole)
    if (dateRange?.from) params.set('startDate', dateRange.from.toISOString().split('T')[0])
    if (dateRange?.to) params.set('endDate', dateRange.to.toISOString().split('T')[0])
    if (searchTerm) params.set('search', searchTerm)
    params.set('dateType', dateType)
    router.push(`/admin/approvals?${params.toString()}`)
  }

  return (
    <div className="space-y-4 bg-card p-4 rounded-lg relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent  className=' relative z-[70]'>
            <ScrollArea className="h-[200px]">

              <SelectItem value="all_categories" className=' relative z-[70]'>All Categories</SelectItem>
              {Object.values(categories).map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="user">User</Label>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger id="user">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent  className=' relative z-[70]'>
              <Input
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="mb-2"
              />
              <ScrollArea className="h-[200px]">
                <SelectItem value="all_users">All Users</SelectItem>
                {filteredUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent  className=' relative z-[70]'>
              <SelectItem value="all_roles">All Roles</SelectItem>
              {Object.values(Role).map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
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
            placeholder="Search by title or content"
          />
        </div>
        <div className="xl:col-span-2">
          <Label>Date Range</Label>
          <div className="flex items-center gap-2 flex-col md:flex-row">
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            <div className="flex">
              <Button
                type="button"
                variant={dateType === 'created' ? 'default' : 'outline'}
                onClick={() => setDateType('created')}
                className="rounded-r-none"
              >
                Created
              </Button>
              <Button
                type="button"
                variant={dateType === 'updated' ? 'default' : 'outline'}
                onClick={() => setDateType('updated')}
                className="rounded-l-none"
              >
                Updated
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-end">
        <Button onClick={handleFilter}>Apply Filter</Button>
      </div>
    </div>
  )
}

