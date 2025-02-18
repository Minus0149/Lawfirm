"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search, ChevronRight, ChevronDown, MoonIcon, SunIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import type { Category } from "@/types/category"
import { useRouter } from "next/navigation"

interface MobileHeaderProps {
  categories: Category[]
}

export function MobileHeader({ categories }: MobileHeaderProps) {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const router = useRouter()
  const isAuthorized = session?.user?.role && ["SUPER_ADMIN", "ADMIN", "EDITOR", "MANAGER"].includes(session.user.role)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const searchTerm = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
    }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const renderCategories = (categories: Category[], level = 0) => {
    return categories.map((category) => (
      <div key={category.id} className="border-b border-gray-200 last:border-0">
        <div className="flex items-center justify-between py-3 px-4">
          <Link
            href={`/${category.slug}`}
            className="flex-grow text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            {category.name}
          </Link>
          {category.children && category.children.length > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault()
                toggleCategory(category.id)
              }}
              className="p-2"
              aria-label={`Toggle ${category.name} subcategories`}
            >
              {expandedCategories.includes(category.id) ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {category.children && category.children.length > 0 && expandedCategories.includes(category.id) && (
          <div className="bg-muted/50">
            {category.children.map((subCategory) => (
              <Link
                key={subCategory.id}
                href={`/${category.slug}/${subCategory.slug}`}
                className="block py-3 px-8 border-b border-gray-200 last:border-0 hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                {subCategory.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    ))
  }

  return (
    <header className="bg-background text-foreground border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-rlqupY5CGQyQMC7oceFN8xWNALWirf.png"
              alt="Logo"
              width={40}
              height={40}
              className="h-8 w-auto mt-2"
            />
            <span className="text-xl font-bold text-primary">LexInvictus</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 hover:bg-muted" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-muted" aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-t border-muted">
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="search"
                placeholder="Search..."
                name="search"
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </form>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex h-16 items-center justify-between bg-primary px-4 text-primary-foreground">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-primary/90" aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-background text-foreground">
            {renderCategories(categories.filter((c) => !c.parentId))}
            <div className="border-t border-muted">
              <Link
                href="/submit-article"
                className="block py-3 px-4 border-b border-muted hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Submit Article
              </Link>
              <Link
                href="/legal-drafts/new"
                className="block py-3 px-4 border-b border-muted hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Legal Draft
              </Link>
              <Link
                href="/notes"
                className="block py-3 px-4 border-b border-muted hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Notes
              </Link>
              {isAuthorized && (
                <Link
                  href="/admin"
                  className="block py-3 px-4 border-b border-muted hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {session ? (
                <Link
                  href="/api/auth/signout"
                  className="block py-3 px-4 border-b border-muted hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Out
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block py-3 px-4 border-b border-muted hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

