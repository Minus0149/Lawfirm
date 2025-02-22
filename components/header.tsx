"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import type { Category } from "@/types/category"

const TopHeader = dynamic(() => import("./top-header").then((mod) => mod.TopHeader), { ssr: false })
const MainCategoriesHeader = dynamic(() => import("./main-categories-header").then((mod) => mod.MainCategoriesHeader), {
  ssr: false,
})
const SubCategoriesHeader = dynamic(() => import("./sub-categories-header").then((mod) => mod.SubCategoriesHeader), {
  ssr: false,
})
const MobileHeader = dynamic(() => import("./mobile-header").then((mod) => mod.MobileHeader), { ssr: false })

interface HeaderProps {
  categories: Category[]
}

export function Header({ categories }: HeaderProps) {
  const [selectedParentSlug, setSelectedParentSlug] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsClient(true)
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 1100 // Adjust this breakpoint as needed
      setIsMobile(isMobileView)
      localStorage.setItem("isMobileView", JSON.stringify(isMobileView))
    }

    const storedIsMobile = localStorage.getItem("isMobileView")
    if (storedIsMobile !== null) {
      setIsMobile(JSON.parse(storedIsMobile))
    } else {
      checkMobile()
    }

    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean)
    if (pathParts.length > 0) {
      const parentCategory = categories.find((c) => c.slug === pathParts[0])
      setSelectedParentSlug(parentCategory?.slug || null)
    } else {
      setSelectedParentSlug(null)
    }
  }, [pathname, categories])

  if (!isClient) {
    return null // Return null on the server-side and during initial client-side render
  }

  if (isMobile) {
    return <MobileHeader categories={categories} />
  }

  return (
    <header className="shadow-md">
      <TopHeader />
      <MainCategoriesHeader categories={categories} />
      <SubCategoriesHeader categories={categories} selectedParentSlug={selectedParentSlug} />
    </header>
  )
}

