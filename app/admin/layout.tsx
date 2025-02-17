'use client'

import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin-sidebar'
import { AdminHeader } from '@/components/admin-header'
import { LoadingScreen } from '@/components/loading-screen'
import { Suspense, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const navItems = [
  { href: '/admin', label: 'Dashboard', roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MANAGER'] },
  { href: '/admin/articles', label: 'Articles', roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MANAGER'] },
  { href: '/admin/users', label: 'Users', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { href: '/admin/advertisements', label: 'Advertisements', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { href: '/admin/approvals', label: 'Approvals', roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EDITOR'] },
  { href: '/admin/activity-log', label: 'Activity Log', roles: ['SUPER_ADMIN'] },
  { href: '/admin/analytics', label: 'Analytics', roles: ['SUPER_ADMIN', 'ADMIN'] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login?callbackUrl=' + encodeURIComponent('/admin'))
    }
  }, [status])

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (!session || !session.user || !session.user.role || !['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MANAGER'].includes(session.user.role)) {
    return null
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingScreen />}>
        <AdminHeader toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
      </Suspense>
      <div className="flex pt-16">
        <Suspense fallback={<div className="w-64 bg-muted animate-pulse" />}>
          <AdminSidebar session={session} navItems={navItems} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
        </Suspense>
        <main className={`flex-1 p-6 md:ml-64 w-full transition-all duration-300 ease-in-out`}>
          <Suspense fallback={<LoadingScreen />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

