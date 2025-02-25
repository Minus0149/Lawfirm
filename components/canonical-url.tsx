"use client"

import { usePathname } from "next/navigation"

export function CanonicalUrl() {
  const pathname = usePathname()

  return <link rel="canonical" href={`${process.env.NEXT_PUBLIC_APP_URL}${pathname}`} />
}

