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
import { redirect, useRouter } from "next/navigation"
import { ClientOnlyIcon } from "./client-only-icon"

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
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={190}
            className="h-8 w-auto"
          />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-yellow-500 bg-clip-text text-transparent" style={{ backgroundSize: '50% 100%' }}>
            Lex<span className="bg-gradient-to-r from-yellow-500 to-yellow-500 bg-clip-text text-transparent" style={{ backgroundSize: '100% 100%' }}>I</span><span className="bg-gradient-to-r from-yellow-500 to-gray-500 bg-clip-text text-transparent" style={{ backgroundSize: '100% 100%' }}>nvictus</span>
            </span>

        </Link>

        <div className="flex items-center space-x-4">
          <div ref={searchRef} className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <Input
                  type="search"
                  placeholder="Search..."
                  name="search"
                  className="w-64 bg-primary-foreground text-primary pl-4 pr-10 py-2 rounded-full border-2 border-primary-foreground focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary"
                >
                  <ClientOnlyIcon icon={X} className="h-5 w-5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hover:text-primary-foreground transition-colors"
                aria-label="Search"
              >
                <ClientOnlyIcon icon={Search} className="h-5 w-5 mt-1" />
              </button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <ClientOnlyIcon icon={theme === "dark" ? SunIcon : MoonIcon} className="h-5 w-5" />
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
          
            <Link href="/" scroll={false}>
              <Button
              variant="ghost"
              size="sm"
              onClick={async(e) => {
                e.preventDefault();
                router.push('/#mentorship');
                // const mentorshipSection = document.getElementById('mentorship');
                // if (mentorshipSection) {
                //   mentorshipSection.scrollIntoView({ behavior: 'smooth' });
                // }
              }}
              >
              Mentorship
              </Button>
            </Link>

          <Link href="/experiences">
            <Button variant="ghost" size="sm">
              Job Experiences
            </Button>
          </Link>

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
  )
}

