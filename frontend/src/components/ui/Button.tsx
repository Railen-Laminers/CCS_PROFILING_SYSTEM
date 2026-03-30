import React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "default" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50 shadow-sm",
          {
            "bg-[#F97316] text-white hover:bg-orange-600": variant === "primary",
            "bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2A2A]": variant === "secondary",
            "border border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100": variant === "outline",
            "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-none": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
            "h-9 px-3": size === "sm",
            "h-10 px-4 py-2": size === "default",
            "h-11 px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
