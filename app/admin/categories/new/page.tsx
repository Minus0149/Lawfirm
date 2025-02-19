"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function NewCategoryPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [parentCategories, setParentCategories] = useState<any[]>([])

    useEffect(() => {
        const fetchParentCategories = async () => {
            try {
                const response = await fetch("/api/categories")
                if (!response.ok) throw new Error("Failed to fetch categories")
                const data = await response.json()
                setParentCategories(data)
            } catch (error) {
                console.error("Error fetching categories:", error)
                toast({ title: "Error fetching categories", variant: "destructive" })
            }
        }

        fetchParentCategories()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const category = Object.fromEntries(formData)

        if (category.parentId === "0") {
            category.parentId = ""
        }

        try {
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(category),
            })

            if (!response.ok) throw new Error("Failed to create category")

            toast({ title: "Category created successfully" })
            router.push("/admin/categories")
        } catch (error) {
            console.error("Error creating category:", error)
            toast({ title: "Error creating category", variant: "destructive" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Create New Category</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required />
                </div>
                <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" required />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" />
                </div>
                <div>
                    <Label htmlFor="parentId">Parent Category</Label>
                    <Select name="parentId">
                        <SelectTrigger>
                            <SelectValue placeholder="Select parent category" />
                        </SelectTrigger>
                        <SelectContent defaultValue={"0"}>
                            <ScrollArea className="h-[200px]">
                                <SelectItem value="0">None</SelectItem>
                                {parentCategories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </ScrollArea>
                        </SelectContent>
                    </Select>
                </div>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Category"}
                </Button>
            </form>
        </div>
    )
}
