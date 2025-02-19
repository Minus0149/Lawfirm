"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

interface FilterFormProps {
  fields: {
    name: string
    label: string
    type: "text" | "select"
    options?: { value: string; label: string }[]
  }[]
}

export function FilterForm({ fields }: FilterFormProps) {
  const router = useRouter()
  const [filters, setFilters] = useState<Record<string, string>>({})

  const handleInputChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const searchParams = new URLSearchParams(filters)
    router.push(`?${searchParams.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field) => (
          <div key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            {field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                value={filters[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                type="text"
                id={field.name}
                name={field.name}
                value={filters[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="mt-1"
              />
            )}
          </div>
        ))}
      </div>
      <Button type="submit" className="w-full md:w-auto">
        <Search className="w-4 h-4 mr-2" />
        Filter
      </Button>
    </form>
  )
}

