import { ReactNode } from "react"

export type BadgeStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NEUTRAL"
  | "BRAND"

interface BadgeProps {
  status?: BadgeStatus
  children: ReactNode
  icon?: ReactNode
  className?: string
}

const STATUS_LABELS: Record<BadgeStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
  NEUTRAL: "",
  BRAND: "",
}

const STATUS_CLASS: Record<BadgeStatus, string> = {
  PENDING: "badge-pending",
  CONFIRMED: "badge-confirmed",
  COMPLETED: "badge-completed",
  CANCELLED: "badge-cancelled",
  NEUTRAL: "badge-neutral",
  BRAND: "badge-brand",
}

export function Badge({ status = "NEUTRAL", children, icon, className = "" }: BadgeProps) {
  return (
    <span className={`badge ${STATUS_CLASS[status]} ${className}`}>
      {icon}
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: BadgeStatus }) {
  return <Badge status={status}>{STATUS_LABELS[status] || status}</Badge>
}
