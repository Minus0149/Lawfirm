'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  label: string
  roles: string[]
}

interface AdminNavProps {
  navItems: NavItem[]
  toggleSidebar: () => void;
}

export function AdminNav({ navItems, toggleSidebar }: AdminNavProps) {
  const pathname = usePathname()

  return (
    <nav className="h-full py-4">
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={`${item.href}?refresh=true`}
              className={`block px-4 py-2 text-sm font-medium ${
              (item.href === '/admin' && pathname === '/admin') || (item.href !== '/admin' && pathname.startsWith(item.href))
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={() => {
              toggleSidebar()
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

