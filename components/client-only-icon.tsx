"use client"

import { useEffect, useState } from "react"
import type { LucideIcon } from "lucide-react"

interface ClientOnlyIconProps {
  icon: LucideIcon
  className?: string
}

export function ClientOnlyIcon({ icon: Icon, className }: ClientOnlyIconProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <Icon className={className} />
}

