"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface ActionButtonProps extends React.ComponentProps<typeof Button> {
  colorScheme: "feed" | "sleep" | "diaper"
  icon?: React.ReactNode
}

const colorClasses = {
  feed: "bg-feed hover:bg-feed/90 text-feed-foreground shadow-lg shadow-feed/25",
  sleep: "bg-sleep hover:bg-sleep/90 text-sleep-foreground shadow-lg shadow-sleep/25",
  diaper: "bg-diaper hover:bg-diaper/90 text-diaper-foreground shadow-lg shadow-diaper/25",
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ colorScheme, icon, children, className, disabled, ...props }, ref) => {
    return (
      <motion.div
        whileTap={disabled ? {} : { scale: 0.98 }}
        whileHover={disabled ? {} : { scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          ref={ref}
          size="lg"
          disabled={disabled}
          className={cn(
            "w-full h-14 text-base font-semibold rounded-xl transition-colors",
            colorClasses[colorScheme],
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          {...props}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </Button>
      </motion.div>
    )
  }
)
ActionButton.displayName = "ActionButton"
