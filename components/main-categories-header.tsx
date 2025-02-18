"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Category } from "@/types/category"

interface MainCategoriesHeaderProps {
  categories: Category[]
}

export function MainCategoriesHeader({ categories }: MainCategoriesHeaderProps) {
  const pathname = usePathname()
  const mainCategories = categories.filter((category) => !category.parentId)

  return (
    <nav className="bg-[#003875] text-white py-3">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-8">
          {mainCategories.map((category) => (
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
    </nav>
  )
}

