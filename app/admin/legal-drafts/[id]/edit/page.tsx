"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Editor } from "@/components/editor"
import { toast } from "sonner"

export default function EditLegalDraftPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [legalDraft, setLegalDraft] = useState<any>(null)
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchLegalDraft = async () => {
      try {
        const response = await fetch(`/api/legal-drafts/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch legal draft")
        const data = await response.json()
        setLegalDraft(data)
        setContent(data.content)
      } catch (error) {
        console.error("Error fetching legal draft:", error)
        toast.error("Error fetching legal draft")
      }
    }

    fetchLegalDraft()
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
        const response = await fetch(`/api/legal-drafts/${params.id}`, {
          method: "PUT",
          body: formData,
        })
  
        if (!response.ok) throw new Error("Failed to update legal draft")
  
        toast.success("Legal draft updated successfully")
        router.push("/admin/legal-drafts?refresh=true")
      } catch (error) {
        console.error("Error updating legal draft:", error)
        toast.error("Failed to update legal draft")
      } finally {
        setIsLoading(false)
      }
    }

  if (!legalDraft) return <div>Loading...</div>

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Legal Draft</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={legalDraft.title} required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={legalDraft.category} onValueChange={(value) => setLegalDraft({ ...legalDraft, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="agreement">Agreement</SelectItem>
              <SelectItem value="motion">Motion</SelectItem>
              <SelectItem value="pleading">Pleading</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Editor value={content} onChange={setContent} placeholder="Write your legal draft content here..." />
        </div>
        <div>
          <Label htmlFor="file">Attachments (optional)</Label>
          <Input id="file" name="file" type="file" accept=".pdf,.doc,.docx" />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Legal Draft"}
        </Button>
      </form>
    </div>
  )
}

