"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp, Settings, ChevronRight } from "lucide-react"
import Link from "next/link"
import { formatDate, formatPrice } from "@/lib/utils"

type Appointment = {
  id: string
  status: string
  date: string
  startTime: string
  service?: { name?: string; price?: number }
  user?: { name?: string; email?: string }
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    PENDING:   { label: "En attente",  className: "bg-yellow-100 text-yellow-700" },
    CONFIRMED: { label: "Confirmé",    className: "bg-green-100 text-green-700" },
    COMPLETED: { label: "Terminé",     className: "bg-blue-100 text-blue-700" },
    CANCELLED: { label: "Annulé",      className: "bg-red-100 text-red-700" },
  }
  const { label, className } = map[status] ?? { label: status, className: "bg-gray-100 text-gray-600" }
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}>{label}</span>
}

function ClientAvatar({ name }: { name?: string }) {
  const initials = (name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  const colors = ["bg-purple-100 text-purple-700", "bg-blue-100 text-blue-700", "bg-green-100 text-green-700",
                  "bg-orange-100 text-orange-700", "bg-pink-100 text-pink-700"]
  const idx = initials.charCodeAt(0) % colors.length
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${colors[idx]}`}>
      {initials}
    </div>
  )
}

const TABS = [
  { key: "all",       label: "Tous" },
  { key: "PENDING",   label: "En attente" },
  { key: "CONFIRMED", label: "Confirmés" },
  { key: "COMPLETED", label: "Terminés" },
]

export default function BarberDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login")
  }, [status, router])

  useEffect(() => {
    fetch("/api/appointments")
      .then((res) => res.json())
      .then((data) => { setAppointments(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function updateStatus(id: string, newStatus: string) {
    setUpdating(id)
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (res.ok) {
        setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: newStatus } : a))
      }
    } finally {
      setUpdating(null)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const pending   = appointments.filter((a) => a.status === "PENDING")
  const confirmed = appointments.filter((a) => a.status === "CONFIRMED")
  const completed = appointments.filter((a) => a.status === "COMPLETED")
  const revenue   = appointments
    .filter((a) => a.status === "COMPLETED")
    .reduce((sum, a) => sum + (a.service?.price ?? 0), 0)

  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter)
  const barberName = session?.user?.name ?? "Barbier"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{barberName}</h1>
            <p className="text-gray-500 mt-1">Tableau de bord barbier</p>
          </div>
          <Link
            href="/dashboard/barber/services"
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-medium transition"
          >
            <Settings className="w-4 h-4" />
            Gérer mes services
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total</span>
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
            <p className="text-sm text-gray-400 mt-0.5">Rendez-vous</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-yellow-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-yellow-500">En attente</span>
              <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{pending.length}</p>
            <p className="text-sm text-gray-400 mt-0.5">À confirmer</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-green-500">Confirmés</span>
              <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{confirmed.length}</p>
            <p className="text-sm text-gray-400 mt-0.5">Planifiés</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-purple-500">Revenus</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatPrice(revenue)}</p>
            <p className="text-sm text-gray-400 mt-0.5">Ce mois-ci</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => {
            const count = tab.key === "all"
              ? appointments.length
              : appointments.filter((a) => a.status === tab.key).length
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filter === tab.key
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-purple-200 hover:text-purple-600"
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  filter === tab.key ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Appointments list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-14 flex flex-col items-center text-center">
            <Calendar className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">Aucun rendez-vous dans cette catégorie</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((appt) => (
              <div
                key={appt.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:border-purple-100 transition"
              >
                <ClientAvatar name={appt.user?.name} />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {appt.user?.name ?? "Client"}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {appt.service?.name ?? "Service"} · {formatDate(new Date(appt.date))} à {appt.startTime}
                  </p>
                  {appt.service?.price !== undefined && (
                    <p className="text-sm font-semibold text-purple-600 mt-0.5">
                      {formatPrice(appt.service.price)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={appt.status} />

                  {appt.status === "PENDING" && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => updateStatus(appt.id, "CONFIRMED")}
                        disabled={updating === appt.id}
                        title="Confirmer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Confirmer
                      </button>
                      <button
                        onClick={() => updateStatus(appt.id, "CANCELLED")}
                        disabled={updating === appt.id}
                        title="Annuler"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Annuler
                      </button>
                    </div>
                  )}

                  {appt.status === "CONFIRMED" && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => updateStatus(appt.id, "COMPLETED")}
                        disabled={updating === appt.id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Terminer
                      </button>
                      <button
                        onClick={() => updateStatus(appt.id, "CANCELLED")}
                        disabled={updating === appt.id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
