import clsx from "clsx"
import React from "react"

interface Props extends React.ComponentProps<"button"> {
  variant?: "primary" | "neutral"
}

const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "flex items-center gap-2 rounded-lg bg-blue-600 px-2 py-1 font-medium",
          {
            "bg-zinc-200 px-2 py-1 dark:bg-neutral-800 dark:text-white": variant === "neutral",
            "text-white": variant === "primary",
          },
          className
        )}
        {...props}
      />
    )
  }
)

export { Button }
