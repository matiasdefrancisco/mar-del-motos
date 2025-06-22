import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-[#333333] bg-[#1a1a1a] px-3 py-2 text-base text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-[#ffd700] focus-visible:ring-1 focus-visible:ring-[#ffd700]/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
