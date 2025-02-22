"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Category } from "@/types/category"
import { ClientOnlyIcon } from "./client-only-icon"
import { MoreHorizontal, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface SubCategoriesHeaderProps {
  categories: Category[]
  selectedParentSlug: string | null
}

export function SubCategoriesHeader({ categories, selectedParentSlug }: SubCategoriesHeaderProps) {
  const pathname = usePathname()
  const subCategories = categories.filter((category) => {
  const parent = categories.find((c) => c.id === category.parentId)
    return parent && parent.slug === selectedParentSlug
  })
  
  const [isExtraCategoriesOpen, setIsExtraCategoriesOpen] = useState(false)
  
  if (subCategories.length === 0) return null
  
  const extraCategoriesRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (extraCategoriesRef.current && !extraCategoriesRef.current.contains(event.target as Node)) {
        setIsExtraCategoriesOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  return (
    <nav className="bg-[#004C99] text-white py-2">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap justify-center space-x-6">
          {subCategories.slice(0, 7).map((category) => {
            const fullSlug = `/${selectedParentSlug}/${category.slug}`
            return (
              <li key={category.id}>
          <Link
            href={fullSlug}
            className={`text-sm hover:text-gray-300 transition-colors relative
              ${pathname === fullSlug ? "text-white" : "text-gray-300"}
              after:content-[''] after:absolute after:left-0 after:bottom-[-2px] 
              after:w-full after:h-[2px] after:bg-white 
              after:transform after:scale-x-0 after:transition-transform after:duration-300
              ${pathname === fullSlug ? "after:scale-x-100" : ""}
            `}
          >
            {category.name}
          </Link>
              </li>
            )
          })}
          {subCategories.length > 7 && (
            <li>
              <div className="relative z-50">
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsExtraCategoriesOpen(!isExtraCategoriesOpen)
            }}
            className="text-sm hover:text-gray-300 transition-colors"
            aria-label="Toggle extra categories"
          >
            {<ClientOnlyIcon icon={isExtraCategoriesOpen ? X : MoreHorizontal} className="h-5 w-5 mt-1.5" />}
          </button>
          {isExtraCategoriesOpen && (
            <div className="absolute bg-primary border-foreground p-4 mt-2 rounded shadow-lg">
              <ul className="space-y-2">
                {subCategories.slice(7).map((category) => {
            const fullSlug = `/${selectedParentSlug}/${category.slug}`
            return (
              <li key={category.id}>
                <Link
                  href={fullSlug}
                  className={`text-sm hover:text-gray-300 transition-colors relative
              ${pathname === fullSlug ? "text-white" : "text-gray-300"}
              after:content-[''] after:absolute after:left-0 after:bottom-[-2px] 
              after:w-full after:h-[2px] after:bg-white 
              after:transform after:scale-x-0 after:transition-transform after:duration-300
              ${pathname === fullSlug ? "after:scale-x-100" : ""}
                  `}
                  onClick={() => setIsExtraCategoriesOpen(false)}
                >
                  {category.name}
                </Link>
              </li>
            )
                })}
              </ul>
            </div>
          )}
              </div>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

