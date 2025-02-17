'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import WYSIWYGEditor from '@/components/wysiwyg-editor'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Category } from '@prisma/client'
import Image from 'next/image'
import { urlToBase64 } from '@/lib/imageUtils'

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<Category | undefined>(null as unknown as undefined)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageLink, setImageLink] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${params.id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const article = await response.json()
        setTitle(article.title)
        setContent(article.content)
        setCategory(article.category)
        setImagePreview(article.imageUrl || (article.imageFile ? `data:image/jpeg;base64,${Buffer.from(article.imageFile).toString('base64')}` : null))
      } catch (error) {
        console.error('Error fetching article:', error)
        setError('Failed to load article. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchArticle()
  }, [params.id])

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
    setError(null)
    console.log('Sending content:', content);
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('category', category?.id || '')
    if (imageFile) {
      formData.append('imageFile', imageFile)
      formData.set('imageLink', '')
    }
    if (imageLink) {
      formData.append('imageLink', imageLink)
      formData.set('imageFile', '')
    }

    try {
      const response = await fetch(`/api/articles/${params.id}`, {
        method: 'PUT',
        body: formData,
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      toast({
        title: "Success",
        description: "Article updated successfully and is pending approval.",
      })
      router.push('/admin/articles')
    } catch (error) {
      console.error('Error updating article:', error)
      setError('Failed to update article. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            <SelectItem value="LOCAL_NEWS">Local News</SelectItem>
            <SelectItem value="INTERNATIONAL_NEWS">International News</SelectItem>
            <SelectItem value="SPORTS">Sports</SelectItem>
            <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
            <SelectItem value="TECHNOLOGY">Technology</SelectItem>
            <SelectItem value="OPINION">Opinion</SelectItem>
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
        <WYSIWYGEditor initialValue={content} onChange={setContent} />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Article'}
      </Button>
    </form>
  )
}

