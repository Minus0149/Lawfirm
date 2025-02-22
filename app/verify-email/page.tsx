'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"

export default function VerifyEmail() {
 const [isVerifying, setIsVerifying] = useState(false)
 const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null)
 const router = useRouter()
 const searchParams = useSearchParams()
 const code = searchParams.get('code')
 const email = searchParams.get('email')

 useEffect(() => {
   if (code && email) {
     verifyEmail(code, email)
   }
 }, [code, email])

 const verifyEmail = async (verificationCode: string, userEmail: string) => {
   setIsVerifying(true)
   try {
     const response = await fetch('/api/auth/verify-email', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ verificationCode, email: userEmail }),
     })

     if (response.ok) {
       setVerificationStatus('success')
       toast.success("Your email has been successfully verified!")
       setTimeout(() => router.push('/login'), 3000)
     } else {
       setVerificationStatus('error')
       toast.error("Failed to verify your email. Please try again or contact support.")
     }
   } catch (error) {
     console.error('Error verifying email:', error)
     setVerificationStatus('error')
     toast.error("Failed to verify your email. Please try again or contact support.")
   } finally {
     setIsVerifying(false)
   }
 }

 return (
   <div className="min-h-screen flex items-center justify-center bg-background">
     <Card className="w-full max-w-md">
       <CardHeader>
         <CardTitle>Email Verification</CardTitle>
         <CardDescription>
           {isVerifying ? 'Verifying your email...' : 'Your email verification status'}
         </CardDescription>
       </CardHeader>
       <CardContent>
         {isVerifying ? (
           <p className="text-center">Please wait while we verify your email...</p>
         ) : verificationStatus === 'success' ? (
           <div className="text-center">
             <p className="text-green-600 dark:text-green-400">Your email has been successfully verified!</p>
             <p>Redirecting to login page...</p>
           </div>
         ) : verificationStatus === 'error' ? (
           <p className="text-center text-red-600 dark:text-red-400">
             Failed to verify your email. Please try again or contact support.
           </p>
         ) : (
           <p className="text-center">Waiting for verification...</p>
         )}
       </CardContent>
       {verificationStatus === 'error' && (
         <CardFooter className="flex justify-center">
           <Button onClick={() => router.push('/signup')}>
             Back to Sign Up
           </Button>
         </CardFooter>
       )}
     </Card>
   </div>
 )
}

