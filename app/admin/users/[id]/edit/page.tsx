'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Image from 'next/image'
import { Role } from '@prisma/client'

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const availableRoles = session?.user?.role === 'SUPER_ADMIN' 
    ? ['USER', 'EDITOR', 'ADMIN', 'MANAGER', 'SUPER_ADMIN']
    : ['USER', 'EDITOR']

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const userData = await response.json()
        setFormData({
          name: userData.name,
          email: userData.email,
          role: userData.role,
        })
        if (userData.imageFile) {
          setCurrentImage(`data:image/jpeg;base64,${userData.imageFile.toString('base64')}`)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        toast.error('Failed to fetch user data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('email', formData.email)
    formDataToSend.append('role', formData.role)
    if (imageFile) {
      formDataToSend.append('imageFile', imageFile)
    }

    try {
      const response = await fetch(`/api/users/${params.id}`, {
        method: 'PUT',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      toast.success('User updated successfully')
      router.push('/admin/users?refresh=true')
      router.refresh()
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
      setCurrentImage(URL.createObjectURL(e.target.files[0]))
    }
  }

  // Redirect if user doesn't have permission
  if (!session?.user?.role || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    router.push('/admin')
    return null
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value as Role })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="image">Profile Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      {currentImage && (
        <div>
          <Label>Current Image</Label>
          <div className="relative w-32 h-32 mt-2">
            <Image
              src={currentImage}
              alt="User profile"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
        </div>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update User'}
      </Button>
    </form>
  )
}

