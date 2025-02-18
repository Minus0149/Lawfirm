"use client"

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { TopHeader } from './top-header'
import { MainCategoriesHeader } from './main-categories-header'
import { SubCategoriesHeader } from './sub-categories-header'
import { MobileHeader } from './mobile-header'
import type { Category } from "@/types/category"

interface HeaderProps {
  categories: Category[]
}

export function Header({ categories }: HeaderProps) {
  const [selectedParentSlug, setSelectedParentSlug] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // Adjust this breakpoint as needed
    }

    handleResize() // Check initial size
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const pathParts = pathname.split('/').filter(Boolean)
    if (pathParts.length > 0) {
      const parentCategory = categories.find(c => c.slug === pathParts[0])
      setSelectedParentSlug(parentCategory?.slug || null)
    } else {
      setSelectedParentSlug(null)
    }
  }, [pathname, categories])

  // Organize categories into a hierarchical structure
  const organizedCategories = categories.filter(c => !c.parentId).map(c => ({
    ...c,
    children: categories.filter(child => child.parentId === c.id)
  }))

  if (isMobile) {
    return <MobileHeader categories={organizedCategories} />
  }

  return (
    <header>
      <TopHeader />
      <MainCategoriesHeader categories={categories.filter(c => !c.parentId)} />
      <SubCategoriesHeader categories={categories} selectedParentSlug={selectedParentSlug} />
    </header>
  )
}
