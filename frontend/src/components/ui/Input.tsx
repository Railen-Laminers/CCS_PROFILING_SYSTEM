import React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-[#252525] dark:text-gray-100 dark:placeholder:text-gray-400",
            error && "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm shadow-sm transition-colors text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-[#252525] dark:text-gray-100",
            error && "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Select.displayName = "Select"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm shadow-sm transition-colors text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-[#252525] dark:text-gray-100 dark:placeholder:text-gray-400",
            error && "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Input, Select, Textarea }
