import React from "react"
import { cn } from "@/lib/utils"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 dark:bg-[#1E1E1E] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700",
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-3 flex h-12 w-12 items-center justify-center text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 max-w-sm mb-4">
            {description}
          </p>
        )}
        {action && <div>{action}</div>}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
