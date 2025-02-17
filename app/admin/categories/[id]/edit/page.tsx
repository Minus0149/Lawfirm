"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [category, setCategory] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [parentCategories, setParentCategories] = useState<any[]>([])

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch category")
        const data = await response.json()
        setCategory(data)
      } catch (error) {
        console.error("Error fetching category:", error)
        toast({ title: "Error fetching category", variant: "destructive" })
      }
    }

    const fetchParentCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
        setParentCategories(data.filter((cat: any) => cat.id !== params.id))
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({ title: "Error fetching categories", variant: "destructive" })
      }
    }

    fetchCategory()
    fetchParentCategories()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const updatedCategory = Object.fromEntries(formData)

    try {
      const response = await fetch(`/api/categories/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCategory),
      })

      if (!response.ok) throw new Error("Failed to update category")

      toast({ title: "Category updated successfully" })
      router.push("/admin/categories")
    } catch (error) {
      console.error("Error updating category:", error)
      toast({ title: "Error updating category", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!category) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={category.name} required />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={category.slug} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={category.description} />
        </div>
        <div>
          <Label htmlFor="parentId">Parent Category</Label>
          <Select name="parentId" defaultValue={category.parentId || "0"}>
            {" "}
            {/* Changed default value */}
            <SelectTrigger>
              <SelectValue placeholder="Select parent category" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                {parentCategories.map((parentCategory) => (
                  <SelectItem key={parentCategory.id} value={parentCategory.id}>
                    {parentCategory.name}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Category"}
        </Button>
      </form>
    </div>
  )
}

