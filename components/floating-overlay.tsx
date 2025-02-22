"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, LucideMousePointer2, Users, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export function FloatingOverlay() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  if (pathname.includes("admin")) return null
  return (
    <Link href="/enquiry">
    <Button variant="outline" className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 h-12" onClick={() => setIsVisible(true)}>
        <LucideMousePointer2/>
    </Button>
    </Link>
  )

  // return (
  //   <AnimatePresence>
  //     <motion.div
  //       initial={{ opacity: 0, y: 100 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       exit={{ opacity: 0, y: 100 }}
  //       className="fixed bottom-4 right-4 z-50 "
  //     >
  //       <div className="bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg p-4 space-y-2">
  //         <div className="flex justify-between items-center mb-2">
  //           <h3 className="font-semibold">Quick Actions</h3>
  //           <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsVisible(false)}>
  //             <X className="h-4 w-4" />
  //           </Button>
  //         </div>
  //         <div className="space-y-4">
  //           <Link href="/">
  //             <Button variant="outline" className="w-full" onClick={() => setIsVisible(false)}>
  //               <Home className="mr-2 h-4 w-4" />
  //               Home
  //             </Button>
  //           </Link>
  //           <Link href="/community" >
  //             <Button className="w-full mt-2" onClick={() => setIsVisible(false)}>
  //               <Users className="mr-2 h-4 w-4" />
  //               Join Community
  //             </Button>
  //           </Link>
  //         </div>
  //       </div>
  //     </motion.div>
  //   </AnimatePresence>
  // )
}

