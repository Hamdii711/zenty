"use client"

import { ButtonHTMLAttributes, ReactNode } from "react"
import { Loader2 } from "lucide-react"

type Variant = "primary" | "secondary" | "ghost" | "danger"
type Size = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "btn-primary"
      : variant === "secondary"
      ? "btn-secondary"
      : variant === "ghost"
      ? "btn-ghost"
      : "btn-danger"

  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "btn-md"
  const widthClass = fullWidth ? "w-full" : ""

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="inline-flex">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </button>
  )
}
