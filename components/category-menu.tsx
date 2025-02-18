import Link from "next/link"
import { ChevronDown } from "lucide-react"
import type { Category } from "@/types/category"

interface CategoryMenuProps {
  categories: Category[]
}

export function CategoryMenu({ categories }: CategoryMenuProps) {
  return (
    <>
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
                    href={`/${child.slug}`}
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
    </>
  )
}

