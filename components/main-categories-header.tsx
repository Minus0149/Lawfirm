"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { Category } from "@/types/category"
import { useEffect, useRef, useState } from "react"
import { ClientOnlyIcon } from "./client-only-icon"
import { Input } from "./ui/input"
import { HomeIcon, Search, X, MoreHorizontal} from "lucide-react"

interface MainCategoriesHeaderProps {
  categories: Category[]
}

export function MainCategoriesHeader({ categories }: MainCategoriesHeaderProps) {
  const pathname = usePathname()
  const mainCategories = categories.filter((category) => !category.parentId)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  const router =  useRouter()
  const [isExtraCategoriesOpen, setIsExtraCategoriesOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const extraCategoriesRef = useRef<HTMLDivElement>(null)

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery("")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearch()
      }
      if (extraCategoriesRef.current && !extraCategoriesRef.current.contains(event.target as Node)) {
        setIsExtraCategoriesOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [closeSearch])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const searchTerm = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
  }
  return (
    <nav className="bg-[#2b447c] text-white py-3 ">
      <div className="container mx-auto self-center px-4 h-8 flex align-center justify-center">
        <ul className="flex justify-center items-center space-x-8">
          {mainCategories.slice(0, 6).map((category) => (
            <li key={category.id}>
              <Link
          href={`/${category.slug}`}
          className={`text-base font-medium hover:text-gray-300 transition-colors relative
            ${pathname === `/${category.slug}` ? "text-white" : "text-gray-300"}
            after:content-[''] after:absolute after:left-0 after:bottom-[-4px] 
            after:w-full after:h-[2px] after:bg-white 
            after:transform after:scale-x-0 after:transition-transform after:duration-300
            ${pathname === `/${category.slug}` ? "after:scale-x-100" : ""}
          `}
              >
          {category.name.toUpperCase()}
              </Link>
            </li>
          ))}
          {mainCategories.length > 6 && (
            <li>
              <div className="relative z-50" ref={extraCategoriesRef}>
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsExtraCategoriesOpen(!isExtraCategoriesOpen)
            }}
            className="text-base font-medium hover:text-gray-300 transition-colors"
            aria-label="Toggle extra categories"
          >
            {<ClientOnlyIcon icon={isExtraCategoriesOpen? X : MoreHorizontal} className="h-5 w-5 mt-1.5" />}
          </button>
          {isExtraCategoriesOpen && (
            <div className="absolute bg-primary border-foreground p-4 mt-2 rounded shadow-lg">
              <ul className="space-y-2">
                {mainCategories.slice(6).map((category) => (
            <li key={category.id}>
              <Link
                href={`/${category.slug}`}
                className={`text-base font-medium hover:text-gray-300 transition-colors relative
                  ${pathname === `/${category.slug}` ? "text-white" : "text-gray-300"}
                  after:content-[''] after:absolute after:left-0 after:bottom-[-4px] 
                  after:w-full after:h-[2px] after:bg-white 
                  after:transform after:scale-x-0 after:transition-transform after:duration-300
                  ${pathname === `/${category.slug}` ? "after:scale-x-100" : ""}
                `}
              >
                {category.name.toUpperCase()}
              </Link>
            </li>
                ))}
              </ul>
            </div>
          )}
              </div>
            </li>
          )}
        </ul>
        <div ref={searchRef} className="relative ml-auto flex items-center align-center justify-center">
            {isSearchOpen ? (
              <form onSubmit={handleSearch}>
                <Input
                  type="search"
                  placeholder="Search..."
                  name="search"
                  className="w-64 bg-primary-foreground text-primary pl-4 pr-10 py-3 rounded-full border-2 border-primary-foreground focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary"
                >
                  <ClientOnlyIcon icon={X} className="h-5 w-5 " />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hover:text-primary-foreground transition-colors"
                aria-label="Search"
              >
                <ClientOnlyIcon icon={Search} className="h-5 w-5 " />
              </button>
            )}
            
          </div>
          { pathname === "/" || <Link href="/" className="ml-6">
              <ClientOnlyIcon icon={HomeIcon} className="h-5 w-5 mt-1.5" />
            </Link>}
      </div>
    </nav>
  )
}

