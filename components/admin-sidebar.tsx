'use client'

import { AdminNav } from '@/components/admin-nav'
import { Session } from "next-auth"

interface NavItem {
  href: string
  label: string
  roles: string[]
}

interface AdminSidebarProps {
  session: Session
  navItems: NavItem[]
  isOpen: boolean
  toggleSidebar: () => void;
}

export function AdminSidebar({ session, navItems, isOpen, toggleSidebar }: AdminSidebarProps) {
  return (
    <aside className={`bg-card text-card-foreground shadow-lg w-64 min-h-screen overflow-y-auto fixed top-0 pt-16 z-30
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0 transition-transform duration-200 ease-in-out`}
    >
      <div className="sticky top-0 bg-card z-10">
        <nav className="min-h-screen py-1 pb-20">
          <AdminNav toggleSidebar={toggleSidebar} navItems={navItems.filter(item => item.roles.includes(session.user.role as string))} />
        </nav>
      </div>
    </aside>
  )
}

