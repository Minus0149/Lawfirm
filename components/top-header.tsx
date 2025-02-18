"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, X, MoonIcon, SunIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

export function TopHeader() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router =  useRouter()

  const isAuthorized = session?.user?.role && ["SUPER_ADMIN", "ADMIN", "EDITOR", "MANAGER"].includes(session.user.role)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const searchTerm = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
  }
  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery("")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearch()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [closeSearch]) // Added closeSearch to dependencies

  return (
    <div className="bg-[#002A5C] text-white py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-rlqupY5CGQyQMC7oceFN8xWNALWirf.png"
            alt="Logo"
            width={40}
            height={40}
            className="h-8 w-auto"
          />
          <span className="text-xl font-bold text-primary">LexInvictus</span>

        </Link>

        <div className="flex items-center space-x-4">
          <div ref={searchRef} className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <Input
                  type="search"
                  placeholder="Search..."
                  name="search"
                  className="w-64 bg-white text-black pl-4 pr-10 py-2 rounded-none border-2 border-secondary"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hover:text-gray-300 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>

          {isAuthorized && (
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                Admin
              </Button>
            </Link>
          )}

          <Link href="/submit-article">
            <Button variant="ghost" size="sm">
              Submit Article
            </Button>
          </Link>

          <Link href="/legal-drafts/new">
            <Button variant="ghost" size="sm">
              Legal Draft
            </Button>
          </Link>

          {session ? (
            <Link href="/api/auth/signout">
              <Button variant="ghost" size="sm">
                Sign Out
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

