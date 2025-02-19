"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function EditExperiencePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [experience, setExperience] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await fetch(`/api/experiences/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch experience")
        const data = await response.json()
        setExperience(data)
      } catch (error) {
        console.error("Error fetching experience:", error)
        toast({ title: "Error fetching experience", variant: "destructive" })
      }
    }

    fetchExperience()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const experienceData = Object.fromEntries(formData)

    try {
      const response = await fetch(`/api/experiences/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(experienceData),
      })

      if (!response.ok) throw new Error("Failed to update experience")

      toast({ title: "Experience updated successfully" })
      router.push("/admin/experiences")
    } catch (error) {
      console.error("Error updating experience:", error)
      toast({ title: "Error updating experience", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!experience) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Experience</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={experience.title} required />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" defaultValue={experience.company} required />
        </div>
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={experience.startDate.split("T")[0]}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date (leave blank if current)</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={experience.endDate ? experience.endDate.split("T")[0] : ""}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={experience.description} required />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Experience"}
        </Button>
      </form>
    </div>
  )
}

