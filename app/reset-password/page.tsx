'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function ResetPassword() {
 const [password, setPassword] = useState('')
 const [confirmPassword, setConfirmPassword] = useState('')
 const [isLoading, setIsLoading] = useState(false)
 const router = useRouter()
 const searchParams = useSearchParams()
 const token = searchParams.get('token')

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
   if (password !== confirmPassword) {
     toast({
       title: "Error",
       description: "Passwords do not match",
       variant: "destructive",
     })
     return
   }
   setIsLoading(true)
   try {
     const response = await fetch('/api/auth/reset-password', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         token,
         password,
       }),
     })

     if (response.ok) {
       toast({
         title: "Success",
         description: "Your password has been reset successfully.",
       })
       router.push('/login')
     } else {
       const data = await response.json()
       throw new Error(data.message || 'Failed to reset password')
     }
   } catch (error) {
     console.error('Error resetting password:', error)
     toast({
       title: "Error",
       description: error instanceof Error ? error.message : "An error occurred. Please try again.",
       variant: "destructive",
     })
   } finally {
     setIsLoading(false)
   }
 }

 return (
   <div className="min-h-screen flex items-center justify-center bg-background">
     <Card className="w-full max-w-md">
       <CardHeader>
         <CardTitle>Reset Password</CardTitle>
         <CardDescription>Enter your new password below</CardDescription>
       </CardHeader>
       <CardContent>
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="password">New Password</Label>
             <Input
               id="password"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="confirm-password">Confirm New Password</Label>
             <Input
               id="confirm-password"
               type="password"
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               required
             />
           </div>
           <Button type="submit" className="w-full" disabled={isLoading}>
             {isLoading ? 'Resetting...' : 'Reset Password'}
           </Button>
         </form>
       </CardContent>
     </Card>
   </div>
 )
}

