"use client"

import type React from "react"

import { useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Editor } from "@/components/editor"
import { toast } from "sonner"

export default function NewLegalDraftPage() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append("content", content)

    try {
      const response = await fetch("/api/legal-drafts", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to create legal draft")

      toast.success("Legal draft created successfully")
      router.push("/admin/legal-drafts?refresh=true")
    } catch (error) {
      console.error("Error creating legal draft:", error)
      toast.error("Failed to create legal draft")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Legal Draft</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select name="category" required>
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
          {isLoading ? "Creating..." : "Create Legal Draft"}
        </Button>
      </form>
    </div>
  )
}

