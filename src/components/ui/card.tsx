import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "card rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden", // Added .card class
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("card-header flex flex-col space-y-1.5 p-6", className)} // Added .card-header class
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement, // Corrected from HTMLParagraphElement to HTMLDivElement to match usage
  React.HTMLAttributes<HTMLDivElement> // Corrected from HTMLHeadingElement to HTMLDivElement
>(({ className, ...props }, ref) => (
  <div // Changed from h3 to div to match typical CardTitle usage, new CSS targets .card-header .card-title or h3
    ref={ref}
    className={cn(
      "card-title text-2xl font-semibold leading-none tracking-tight", // Added .card-title for easier targeting from new CSS
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement, // Corrected from HTMLParagraphElement
  React.HTMLAttributes<HTMLDivElement> // Corrected from HTMLParagraphElement
>(({ className, ...props }, ref) => (
  <div // Changed from p to div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
