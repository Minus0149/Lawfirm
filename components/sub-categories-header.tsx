"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Category } from "@/types/category"

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

  if (subCategories.length === 0) return null

  return (
    <nav className="bg-[#004C99] text-white py-2">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap justify-center space-x-6">
          {subCategories.map((category) => {
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
        </ul>
      </div>
    </nav>
  )
}

