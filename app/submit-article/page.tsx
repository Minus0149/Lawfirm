'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import WYSIWYGEditor from '@/components/wysiwyg-editor'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Category as PrismaCategory } from '@prisma/client'

interface Category extends PrismaCategory {
  children?: Category[]
}
import Image from 'next/image'
import { urlToBase64 } from '@/lib/imageUtils'
import { Editor } from '@/components/editor'

export default function CreateArticlePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<Category | undefined>(undefined)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageLink, setImageLink] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImageLink('')
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageLinkChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value
    setImageLink(link)
    setImageFile(null)
    if (link) {
      try {
        const base64 = await urlToBase64(link)
        setImagePreview(base64)
      } catch (error) {
        console.error('Error converting image to base64:', error)
        setImagePreview(null)
      }
    } else {
      setImagePreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('category', category?.id || '')
    if (imageFile) {
      formData.append('imageFile', imageFile)
    }
    if (imageLink) {
      formData.append('imageLink', imageLink)
    }

    try {
      const response = await fetch('/api/articles/submission', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        toast.success('Article submitted successfully')
        router.push('/')
      } else {
        throw new Error('Failed to create article')
      }
    } catch (error) {
      console.error('Error creating article:', error)
      toast.error('Failed to create article')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-5xl mx-auto p-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category?.id || undefined} onValueChange={(value) => setCategory({ id: value } as Category)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
            <SelectContent>
              <SelectItem  value="user-submitted">
              User Submitted
              </SelectItem>
            </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="imageFile">Image File</Label>
        <Input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <div>
        <Label htmlFor="imageLink">Image Link</Label>
        <Input
          id="imageLink"
          type="url"
          value={imageLink}
          onChange={handleImageLinkChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      {imagePreview && (
        <div className="mt-4">
          <Label>Image Preview</Label>
          <div className="relative h-48 w-full">
            <Image
              src={imagePreview}
              alt="Article image preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
      <div>
        <Label htmlFor="content">Content</Label>
        <Editor value={content} onChange={setContent} placeholder="Article content starts here..." />
        {/* <WYSIWYGEditor initialValue="" onChange={setContent} /> */}
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Article'}
      </Button>
    </form>
  )
}
