'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function Signup() {
 const [name, setName] = useState('')
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [verificationCode, setVerificationCode] = useState('')
 const [isLoading, setIsLoading] = useState(false)
 const [isVerifying, setIsVerifying] = useState(false)
 const router = useRouter()

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
   setIsLoading(true)
   try {
     const response = await fetch('/api/auth/signup', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ 
         name, 
         email, 
         password,
         emailLowercase: email.toLowerCase() 
       }),
     })

     const data = await response.json()

     if (response.ok) {
       setIsVerifying(true)
       toast({
         title: "Success",
         description: "Please check your email for the verification code.",
       })
     } else {
       throw new Error(data.message || 'An error occurred during signup')
     }
   } catch (error) {
     console.error('An error occurred during signup:', error)
     toast({
       title: "Error",
       description: error instanceof Error ? error.message : "An error occurred. Please try again.",
       variant: "destructive",
     })
   } finally {
     setIsLoading(false)
   }
 }

 const handleVerification = async (e: React.FormEvent) => {
   e.preventDefault()
   setIsLoading(true)
   try {
     const response = await fetch('/api/auth/verify-email', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, verificationCode }),
     })

     if (response.ok) {
       toast({
         title: "Success",
         description: "Email verified successfully. You can now log in.",
       })
       router.push('/login')
     } else {
       const data = await response.json()
       throw new Error(data.error || 'An error occurred during email verification')
     }
   } catch (error) {
     console.error('An error occurred during email verification:', error)
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
         <CardTitle>{isVerifying ? 'Verify your email' : 'Create your account'}</CardTitle>
         <CardDescription>
           {isVerifying ? 'Enter the verification code sent to your email' : 'Fill in the details below to sign up'}
         </CardDescription>
       </CardHeader>
       <CardContent>
         {!isVerifying ? (
           <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="name">Name</Label>
               <Input
                 id="name"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 required
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <Input
                 id="email"
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="password">Password</Label>
               <Input
                 id="password"
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
               />
             </div>
             <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading ? 'Signing up...' : 'Sign up'}
             </Button>
           </form>
         ) : (
           <form onSubmit={handleVerification} className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="verification-code">Verification Code</Label>
               <Input
                 id="verification-code"
                 value={verificationCode}
                 onChange={(e) => setVerificationCode(e.target.value)}
                 required
               />
             </div>
             <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading ? 'Verifying...' : 'Verify Email'}
             </Button>
           </form>
         )}
       </CardContent>
       <CardFooter className="flex justify-center">
         <Link href="/login" className="text-sm text-primary hover:underline">
           Already have an account? Sign in
         </Link>
       </CardFooter>
     </Card>
   </div>
 )
}

