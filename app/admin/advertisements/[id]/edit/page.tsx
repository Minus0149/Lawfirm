'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Image from 'next/image'
import { urlToBase64 } from '@/lib/imageUtils'
import { Category as PrismaCategory } from '@prisma/client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { bufferToBase64 } from '@/lib/utils'

interface Category extends PrismaCategory {
  children?: Category[]
}

export default function EditAdvertisementPage({ params }: { params: { id: string } }) {
 const router = useRouter()
 const [ad, setAd] = useState({ link: '', placement: '', startDate: '', endDate: '', location:'', category:'' })
 const [imageFile, setImageFile] = useState<File | null>(null)
 const [imageLink, setImageLink] = useState('')
 const [imagePreview, setImagePreview] = useState<string | null>(null)
 const [isLoading, setIsLoading] = useState(true)
 const [error, setError] = useState<string | null>(null)

 useEffect(() => {
   const fetchAd = async () => {
     try {
       const response = await fetch(`/api/advertisements/${params.id}`)
       if (!response.ok) {
         throw new Error('Failed to fetch advertisement data')

       }
       const adData = await response.json()
       setAd({
         ...adData,
         startDate: new Date(adData.startDate).toISOString().split('T')[0],
         endDate: new Date(adData.endDate).toISOString().split('T')[0],
       })
       if (adData.image || adData.imageFile) {
         setImagePreview(adData.image || `data:image/jpeg;base64,${adData.imageFile instanceof Uint8Array ? bufferToBase64(adData.imageFile) : adData.imageFile}`)
       }
     } catch (error) {
       console.error('Error fetching advertisement:', error)
       setError('Failed to load advertisement data. Please try again.')
     } finally {
       setIsLoading(false)
     }
   }
   fetchAd()
 }, [params.id])

  const [categories, setCategories] = useState<Category[]>([])

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

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
   setIsLoading(true)
   try {
     const formData = new FormData()
     formData.append('id', params.id)
     formData.append('link', ad.link)
     formData.append('placement', ad.placement)
     formData.append('startDate', ad.startDate)
     formData.append('endDate', ad.endDate)
     formData.append('location', ad.location)
     formData.append('category', ad.category || '')
     if (imageFile) {
      formData.append('imageFile', imageFile)
      formData.set('imageLink', '')
    }else if (imageLink) {
      formData.append('imageLink', imageLink)
      formData.set('imageFile', '')
    }
    console.log(formData)
     const response = await fetch(`/api/advertisements/${params.id}`, {
       method: 'PUT',
       body: formData,
     })
     if (!response.ok) {
       throw new Error('Failed to update advertisement')
     }
     toast.success('Advertisement updated successfully')
     router.push('/admin/advertisements')
   } catch (error) {
     console.error('Error updating advertisement:', error)
     setError('Failed to update advertisement. Please try again.')
   } finally {
     setIsLoading(false)
   }
 }

 if (isLoading) return <div>Loading...</div>
 if (error) return <div>Error: {error}</div>

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
           {/* <SelectItem value="IN_ARTICLE">In Article</SelectItem>
           <SelectItem value="FOOTER">Footer</SelectItem> */}
         </SelectContent>
       </Select>
     </div>
     <div >
      <Label htmlFor="location">Location</Label>
      <Select name="location" required value={ad.location} onValueChange={(value) => setAd({ ...ad, location: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent  defaultValue={"ALL"}>
          <SelectItem value="HOME">Home Page</SelectItem>
          <SelectItem value="CATEGORY">Category Pages</SelectItem>
          <SelectItem value="ARTICLE">Article Pages</SelectItem>
          <SelectItem value="ALL">All Pages</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label htmlFor="category">Category</Label>
      <Select value={ad.category} onValueChange={(value) => setAd({ ...ad, category: value })} >
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
       {isLoading ? 'Updating...' : 'Update Advertisement'}
     </Button>
   </form>
 )
}

