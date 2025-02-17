'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ThemeToggle } from '@/components/theme-toggle'

interface AdminHeaderProps {
  toggleSidebar: () => void;
  isOpen:Boolean
}

export function AdminHeader({ toggleSidebar,isOpen }: AdminHeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="bg-card text-card-foreground shadow-md fixed top-0 left-0 right-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin" className="text-2xl font-bold text-primary shrink-0">
            Admin Panel
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {session && (
              <button 
                onClick={() => signOut()} 
                className="text-destructive hover:text-destructive/80"
              >
                Sign Out
              </button>
            )}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

