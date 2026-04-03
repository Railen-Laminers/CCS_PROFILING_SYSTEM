import React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef(
  ({ className, variant = "gray", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg shadow-sm w-fit",
           {
            "bg-zinc-100 text-zinc-900 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700": variant === "gray",
            "bg-[#F97316] text-white border border-[#F97316]": variant === "orange",
            "bg-yellow-500 text-white border border-yellow-500": variant === "yellow",
            "bg-red-500 text-white border border-red-500": variant === "red",
            "bg-[#a855f7] text-white border border-[#a855f7]": variant === "purple",
            "bg-00C950 text-[#fff] border-transparent": variant === "green",
            "bg-white border border-zinc-300 text-zinc-800 dark:bg-[#252525] dark:border-gray-700 dark:text-gray-300": variant === "white",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
