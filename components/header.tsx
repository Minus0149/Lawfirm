"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "./theme-toggle"
import type { Category } from "@/types/category"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'

export function Header() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`)
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const isAuthorized = session?.user?.role && ["SUPER_ADMIN", "ADMIN", "EDITOR", "MANAGER"].includes(session.user.role)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const searchTerm = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-rlqupY5CGQyQMC7oceFN8xWNALWirf.png"
              alt="Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-primary">LexInvictus</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Search..."
              name="search"
              className="w-64"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/submit-article">
              <Button variant="outline" size="sm">
                Submit Article
              </Button>
            </Link>
            <Link href="/legal-drafts">
              <Button variant="outline" size="sm">
                Legal Drafts
              </Button>
            </Link>
            {session ? (
              <Link href="/api/auth/signout">
                <Button size="sm">Sign Out</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Categories section */}
        <nav className="hidden md:flex items-center space-x-1 py-1">
          {categories.map((category) => (
            <div key={category.id} className="relative group">
              <Link
                href={`/${category.slug}`}
                className="inline-flex items-center px-3 py-2 text-sm rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {category.name}
                {category.children && category.children.length > 0 && <ChevronDown className="ml-1 h-4 w-4" />}
              </Link>
              {category.children && category.children.length > 0 && (
                <div className="absolute left-0 top-full hidden group-hover:block pt-2 w-48">
                  <div className="rounded-md bg-popover border shadow-lg">
                    {category.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/${category.slug}/${child.slug}`}
                        className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Link
            href="/notes"
            className="inline-flex items-center px-3 py-2 text-sm rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            Notes
          </Link>
          {isAuthorized && (
            <Link
              href="/admin"
              className="inline-flex items-center px-3 py-2 text-sm rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Admin Dashboard
            </Link>
          )}
        </nav>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            {categories.map((category) => (
              <div key={category.id}>
                <Link
                  href={`/${category.slug}`}
                  className="block py-2 px-4 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {category.name}
                </Link>
                {category.children && category.children.length > 0 && (
                  <div className="pl-4 space-y-1">
                    {category.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/${category.slug}/${child.slug}`}
                        className="block py-1 px-4 text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/notes"
              className="block py-2 px-4 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Notes
            </Link>
            {isAuthorized && (
              <Link
                href="/admin"
                className="block py-2 px-4 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

