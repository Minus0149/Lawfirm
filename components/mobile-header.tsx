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

interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[]
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

  const groupCategories = (categories: Category[]): CategoryWithChildren[] => {
    const categoryMap = new Map<string, CategoryWithChildren>()
    const rootCategories: CategoryWithChildren[] = []

    categories.forEach((category) => {
      const categoryWithChildren = { ...category, children: [] }
      categoryMap.set(category.id, categoryWithChildren)

      if (category.parentId) {
        const parent = categoryMap.get(category.parentId)
        if (parent) {
          parent.children.push(categoryWithChildren)
        }
      } else {
        rootCategories.push(categoryWithChildren)
      }
    })

    return rootCategories
  }

  const renderCategories = (categories: CategoryWithChildren[], level = 0) => {
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
          {category.children.length > 0 && (
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
        {category.children.length > 0 && expandedCategories.includes(category.id) && (
          <div className="bg-muted/50 pl-4">{renderCategories(category.children, level + 1)}</div>
        )}
      </div>
    ))
  }

  const groupedCategories = groupCategories(categories)


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
            
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-yellow-500 bg-clip-text text-transparent" style={{ backgroundSize: '50% 100%' }}>
            Lex<span className="bg-gradient-to-r from-yellow-500 to-yellow-500 bg-clip-text text-transparent" style={{ backgroundSize: '100% 100%' }}>I</span><span className="bg-gradient-to-r from-yellow-500 to-gray-500 bg-clip-text text-transparent" style={{ backgroundSize: '100% 100%' }}>nvictus</span>
            </span>
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
            {renderCategories(groupedCategories)}
            <div className="border-t border-muted">
              <Link
                href="/submit-article"
                className="block py-3 px-4 border-b border-muted hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Submit Article
              </Link>
              {/* <Link
                href="/legal-drafts/new"
                className="block py-3 px-4 border-b border-muted hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Legal Draft
              </Link> */}
              <Link
                href="/notes"
                className="block py-3 px-4 border-b border-muted hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Notes
              </Link>

              <Link 
              className="block py-3 px-4 border-b border-muted hover:bg-muted"
              href="/" scroll={false} 
              onClick={async(e) => {
                e.preventDefault();
                router.push('/#mentorship');
                // const mentorshipSection = document.getElementById('mentorship');
                // if (mentorshipSection) {
                //   mentorshipSection.scrollIntoView({ behavior: 'smooth' });
                // }
                setIsMenuOpen(false)
              }}>
              
              Mentorship
            </Link>

              <Link
                href="/experiences"
                className="block py-3 px-4 border-b border-muted hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Job Experiences
              </Link>

              <Link
                href="/community"
                className="block py-3 px-4 border-b border-muted hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Join Community
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
              {session && (
            <Link href="/api/auth/signout">
              <Button variant="ghost" size="sm">
                Sign Out
              </Button>
            </Link>
          )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

