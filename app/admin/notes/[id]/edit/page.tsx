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

export default function EditNotePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [note, setNote] = useState<any>(null)
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch note")
        const data = await response.json()
        setNote(data)
        setContent(data.content)
      } catch (error) {
        console.error("Error fetching note:", error)
        toast.error("Error fetching note")
      }
    }

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

    fetchNote()
    fetchCategories()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append("content", content)

    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0]
        formData.append("file", file, file.name)
      } else {
        formData.append("file", '')
    }

    try {
      const response = await fetch(`/api/notes/${params.id}`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to update note")

      toast.success("Note updated successfully")
      router.push("/admin/notes")
    } catch (error) {
      console.error("Error updating note:", error)
      toast.error("Failed to update note")
    } finally {
      setIsLoading(false)
    }
  }

  if (!note) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Note</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={note.title} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={note.description} />
        </div>
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select name="categoryId" defaultValue={note.categoryId}>
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
          <Label htmlFor="file">Attachment (optional)</Label>
          <Input id="file" name="file" type="file" accept=".pdf,.doc,.docx" />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Note"}
        </Button>
      </form>
    </div>
  )
}

