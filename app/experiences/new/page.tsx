"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewExperiencePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const experienceData = Object.fromEntries(formData)

    try {
      const response = await fetch("/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(experienceData),
      })

      if (!response.ok) throw new Error("Failed to create experience")

      toast({ title: "Experience shared successfully" })
      router.push("/experiences")
    } catch (error) {
      console.error("Error creating experience:", error)
      toast({ title: "Error sharing experience", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/experiences" className="flex items-center text-primary hover:underline mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Experiences
      </Link>
      <h1 className="text-3xl font-bold mb-6">Share Your Experience</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" name="age" type="number" required />
          </div>
        </div>
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input id="title" name="title" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" required />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" name="startDate" type="date" required />
          </div>
          <div>
            <Label htmlFor="endDate">End Date (leave blank if current)</Label>
            <Input id="endDate" name="endDate" type="date" />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" required rows={5} />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sharing..." : "Share Experience"}
        </Button>
      </form>
    </div>
  )
}

