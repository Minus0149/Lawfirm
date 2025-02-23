"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Editor } from "@/components/editor"
import { toast } from "sonner"
import { Category } from "@prisma/client"

export default function NewNotePage() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
      
        setCategories(data.filter((category: Category) => category.name.toLocaleLowerCase().includes("note")))
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast.error("Error fetching categories")
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append("content", content)

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to create note")

      toast.success("Note created successfully") 
      router.push("/admin/notes?refresh=true")
    } catch (error) {
      console.error("Error creating note:", error)
      toast.error("Failed to create note")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Note</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" />
        </div>
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select name="categoryId" required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Editor value={content} onChange={setContent} placeholder="Write your note content here..." />
        </div>
        <div>
          <Label htmlFor="file">Attachment</Label>
          <Input id="file" name="file" type="file" accept=".pdf,.doc,.docx" required />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Note"}
        </Button>
      </form>
    </div>
  )
}
