"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from 'lucide-react'

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogOverlay = React.forwardRef<
 React.ElementRef<typeof DialogPrimitive.Overlay>,
 React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
 <DialogPrimitive.Overlay
   ref={ref}
   className={cn(
     "fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
     className
   )}
   {...props}
 />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
 React.ElementRef<typeof DialogPrimitive.Content>,
 React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
 <DialogPrimitive.Content
   ref={ref}
   className={cn(
     "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 max-w-2xl rounded-lg border border-gray-200 bg-background p-6 shadow-lg outline-none focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
     className
   )}
   {...props}
 >
   {children}
 </DialogPrimitive.Content>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
 <div className={cn("flex items-center justify-between mb-4", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
 <h2 className={cn("text-lg font-semibold", className)} {...props} />
)
DialogTitle.displayName = "DialogTitle"

const DialogDescription = ({
 className,
 ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
 <p className={cn("text-sm text-muted-foreground", className)} {...props} />
)
DialogDescription.displayName = "DialogDescription"

const DialogClose = React.forwardRef<
 React.ElementRef<typeof DialogPrimitive.Close>,
 React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
 <DialogPrimitive.Close
   ref={ref}
   className={cn(
     "absolute right-4 top-4 rounded-sm p-1.5 hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
     className
   )}
   {...props}
 >
   <X className="h-4 w-4" />
 </DialogPrimitive.Close>
))
DialogClose.displayName = DialogPrimitive.Close.displayName

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
 <div className={cn("flex items-center justify-end gap-2 mt-4", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

export {
 Dialog,
 DialogTrigger,
 DialogOverlay,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogDescription,
 DialogClose,
 DialogFooter,
}