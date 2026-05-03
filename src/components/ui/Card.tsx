"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { Clock, MapPin, Scissors, ArrowRight, Calendar } from "lucide-react"
import { Avatar, colorFromName } from "./Avatar"
import { Rating } from "./Rating"
import { StatusBadge, BadgeStatus } from "./Badge"

/* ----------------------------- Generic Card ----------------------------- */

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  as?: "div" | "article"
}

export function Card({ children, className = "", hover = true, as = "div" }: CardProps) {
  const Tag = as
  return (
    <Tag className={`card ${hover ? "card-hover" : ""} ${className}`}>{children}</Tag>
  )
}

/* ----------------------------- ServiceCard ------------------------------ */

interface Service {
  id: string
  name: string
  description?: string | null
  price: number
  duration: number
}

export function ServiceCard({
  service,
  selected = false,
  onSelect,
}: {
  service: Service
  selected?: boolean
  onSelect?: (id: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(service.id)}
      className={`text-left w-full card p-5 transition-all ${
        selected
          ? "border-violet-300 ring-2 ring-violet-200 bg-violet-50/30"
          : "card-hover"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{service.name}</h4>
          {service.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
          )}
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            {service.duration} min
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-bold gradient-text">
            {(service.price / 100).toFixed(2)} €
          </div>
        </div>
      </div>
    </button>
  )
}

/* ----------------------------- BarberCard ------------------------------- */

interface Barber {
  id: string
  name: string | null
  image?: string | null
  bio?: string | null
  address?: string | null
  services?: { id: string; name: string; price: number; duration: number }[]
  avgRating?: number
  _count?: { barberReviews: number }
  online?: boolean
}

export function BarberCard({ barber }: { barber: Barber }) {
  const palette = colorFromName(barber.name)
  return (
    <Link href={`/barbers/${barber.id}`} className="block animate-fade-in">
      <article className="card card-hover overflow-hidden h-full flex flex-col group">
        {/* Cover with unique gradient */}
        <div className={`relative h-32 bg-gradient-to-br ${palette}`}>
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
              <circle cx="30" cy="30" r="40" fill="white" opacity="0.3" />
              <circle cx="170" cy="80" r="50" fill="white" opacity="0.2" />
            </svg>
          </div>
          <div className="absolute -bottom-8 left-5">
            <Avatar name={barber.name} src={barber.image} size="lg" online={barber.online ?? true} />
          </div>
        </div>

        <div className="pt-10 px-5 pb-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-violet-600 transition">
                {barber.name}
              </h3>
              {barber.address && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{barber.address}</span>
                </div>
              )}
            </div>
            {typeof barber.avgRating === "number" && barber.avgRating > 0 && (
              <Rating
                value={barber.avgRating}
                size="sm"
                reviewsCount={barber._count?.barberReviews}
              />
            )}
          </div>

          {/* Services */}
          {barber.services && barber.services.length > 0 && (
            <div className="mt-4 space-y-1.5">
              {barber.services.slice(0, 2).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-sm py-1"
                >
                  <span className="text-gray-600 inline-flex items-center gap-1.5 truncate">
                    <Scissors className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{s.name}</span>
                  </span>
                  <span className="font-semibold text-violet-700 shrink-0">
                    {(s.price / 100).toFixed(0)} €
                  </span>
                </div>
              ))}
              {barber.services.length > 2 && (
                <p className="text-xs text-gray-400">
                  +{barber.services.length - 2} autres prestations
                </p>
              )}
            </div>
          )}

          {/* CTA reveal */}
          <div className="mt-auto pt-4">
            <div className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0">
              Réserver
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

/* --------------------------- AppointmentCard ---------------------------- */

interface Appointment {
  id: string
  status: BadgeStatus
  startTime: string | Date
  service?: { name: string; price: number; duration: number }
  barber?: { name: string | null; image?: string | null }
  client?: { name: string | null; image?: string | null }
}

function formatDateTime(d: string | Date) {
  const date = new Date(d)
  return date.toLocaleString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function AppointmentCard({
  appointment,
  perspective = "client",
}: {
  appointment: Appointment
  perspective?: "client" | "barber"
}) {
  const counterpart =
    perspective === "client" ? appointment.barber : appointment.client
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <Avatar name={counterpart?.name} src={counterpart?.image} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-gray-900 truncate">
              {appointment.service?.name || "Rendez-vous"}
            </h4>
            <StatusBadge status={appointment.status} />
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className="truncate">{formatDateTime(appointment.startTime)}</span>
          </div>
          {counterpart?.name && (
            <p className="text-xs text-gray-400 mt-0.5">
              avec <span className="text-gray-600">{counterpart.name}</span>
            </p>
          )}
        </div>
        {appointment.service && (
          <div className="text-right shrink-0">
            <div className="font-bold text-violet-700">
              {(appointment.service.price / 100).toFixed(0)} €
            </div>
            <div className="text-xs text-gray-400">{appointment.service.duration} min</div>
          </div>
        )}
      </div>
    </Card>
  )
}
