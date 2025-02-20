'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import Image from 'next/image'
import { urlToBase64 } from '@/lib/imageUtils'
import { Category as PrismaCategory } from '@prisma/client'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Category extends PrismaCategory {
  children?: Category[]
}

export default function CreateAdvertisementPage() {
  const router = useRouter()
  const [ad, setAd] = useState({ link: '', placement: '', startDate: '', endDate: '' })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageLink, setImageLink] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [category, setCategory] = useState<Category | null>(null)

  useEffect(() => {
      // Helper function to flatten categories
      function flattenCategories(categories: Category[]): Category[] {
        return categories.reduce((acc: Category[], category: Category) => {
          acc.push(category)
          if (category.children && category.children.length > 0) {
            acc.push(...flattenCategories(category.children))
          }
          return acc
        }, [])
      }
  
      // Fetch categories from your API or data source
      async function fetchCategories() {
        try {
          const response = await fetch('/api/categories')
          const data = await response.json()
          const allCategories = flattenCategories(data)
          setCategories(allCategories)
        } catch (error) {
          console.error('Error fetching categories:', error)
        }
      }
      fetchCategories()
    }, [])

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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setIsLoading(true)
  //   try {
  //     const formData = new FormData()
  //     formData.append('link', ad.link)
  //     formData.append('placement', ad.placement)
  //     formData.append('startDate', ad.startDate)
  //     formData.append('endDate', ad.endDate)
  //     if (imageFile) {
  //       formData.append('imageFile', imageFile)
  //     }
  //     if (imageLink) {
  //       formData.append('imageLink', imageLink)
  //     }

  //     const response = await fetch('/api/advertisements', {
  //       method: 'POST',
  //       body: formData,
  //     })
  //     if (response.ok) {
  //       toast({
  //         title: "Success",
  //         description: "Advertisement created successfully",
  //       })
  //       router.push('/admin/advertisements')
  //     } else {
  //       throw new Error('Failed to create advertisement')
  //     }
  //   } catch (error) {
  //     console.error('Error creating advertisement:', error)
  //     toast({
  //       title: "Error",
  //       description: "Failed to create advertisement",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }
    
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/advertisements", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to create advertisement")

      toast({ title: "Advertisement created successfully" })
      router.push("/admin/advertisements")
    } catch (error) {
      console.error("Error creating advertisement:", error)
      toast({
        title: "Error creating advertisement",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
              alt="Advertisement preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
      <div>
        <Label htmlFor="link">Link</Label>
        <Input
          id="link"
          value={ad.link}
          onChange={(e) => setAd({ ...ad, link: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="placement">Placement</Label>
        <Select value={ad.placement} onValueChange={(value) => setAd({ ...ad, placement: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a placement" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="SIDEBAR">Sidebar</SelectItem> */}
            <SelectItem value="TOP_BANNER">Top Banner</SelectItem>
            <SelectItem value="CATEGORY_PAGE">Category Page</SelectItem>
            {/* <SelectItem value="IN_ARTICLE">In Article</SelectItem>
            <SelectItem value="FOOTER">Footer</SelectItem> */}
          </SelectContent>
        </Select>
      </div>
      <div >
        <Label htmlFor="location">Location</Label>
        <Select name="location" required>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HOME">Home Page</SelectItem>
            <SelectItem value="CATEGORY">Category Pages</SelectItem>
            <SelectItem value="ARTICLE">Article Pages</SelectItem>
            <SelectItem value="ALL">All Pages</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category?.id || undefined} onValueChange={(value) => setCategory({ id: value } as Category)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          
            <SelectContent>
            <ScrollArea className="h-[200px]">
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                {category.name}
                </SelectItem>
              ))}
            </ScrollArea>
            </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={ad.startDate}
          onChange={(e) => setAd({ ...ad, startDate: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="date"
          value={ad.endDate}
          onChange={(e) => setAd({ ...ad, endDate: e.target.value })}
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Advertisement'}
      </Button>
    </form>
  )
}

