"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, XCircle, ChevronRight, Scissors } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { formatDate, formatPrice } from "@/lib/utils"

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    PENDING:   { label: "En attente",  className: "bg-yellow-100 text-yellow-700" },
    CONFIRMED: { label: "Confirmé",    className: "bg-green-100 text-green-700" },
    COMPLETED: { label: "Terminé",     className: "bg-blue-100 text-blue-700" },
    CANCELLED: { label: "Annulé",      className: "bg-red-100 text-red-700" },
  }
  const { label, className } = map[status] ?? { label: status, className: "bg-gray-100 text-gray-600" }
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${className}`}>{label}</span>
  )
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login")
  }, [status, router])

  useEffect(() => {
    fetch("/api/appointments")
      .then((res) => res.json())
      .then((data) => { setAppointments(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function cancelAppointment(id: string) {
    setCancelling(id)
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "CANCELLED" }),
      })
      if (res.ok) {
        setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "CANCELLED" } : a))
      }
    } finally {
      setCancelling(null)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const upcoming = appointments.filter((a) => a.status !== "CANCELLED" && a.status !== "COMPLETED")
  const past     = appointments.filter((a) => a.status === "COMPLETED")
  const cancelled = appointments.filter((a) => a.status === "CANCELLED")
  const nextAppt  = upcoming[0] ?? null

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })
  const firstName = (session?.user?.name ?? "").split(" ")[0] || "vous"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bonjour {firstName} 👋
            </h1>
            <p className="text-gray-500 mt-1 capitalize">{today}</p>
          </div>
          <Link
            href="/booking"
            className="hidden sm:flex items-center gap-1.5 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition"
          >
            <Scissors className="w-4 h-4" />
            Nouveau RDV
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-purple-400">À venir</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{upcoming.length}</p>
            <p className="text-sm text-gray-400 mt-0.5">Rendez-vous</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-400">Passés</span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{past.length}</p>
            <p className="text-sm text-gray-400 mt-0.5">Terminés</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-red-400">Annulés</span>
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{cancelled.length}</p>
            <p className="text-sm text-gray-400 mt-0.5">Annulations</p>
          </div>
        </div>

        {/* Prochain rendez-vous */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Prochain rendez-vous</h2>

          {nextAppt ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-700" />
              <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
                    <Scissors className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      {nextAppt.service?.name ?? "Service"}
                    </p>
                    <p className="text-gray-500 text-sm mt-0.5">
                      Avec <span className="font-medium text-gray-700">{nextAppt.barber?.name ?? "Votre barbier"}</span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      {formatDate(nextAppt.date)} à <span className="font-medium text-gray-700">{nextAppt.startTime}</span>
                    </p>
                    {nextAppt.service?.price && (
                      <p className="text-purple-600 font-semibold text-sm mt-1">
                        {formatPrice(nextAppt.service.price)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <StatusBadge status={nextAppt.status} />
                  {nextAppt.status !== "CANCELLED" && (
                    <button
                      onClick={() => cancelAppointment(nextAppt.id)}
                      disabled={cancelling === nextAppt.id}
                      className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      {cancelling === nextAppt.id ? "Annulation..." : "Annuler"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-14 flex flex-col items-center text-center">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mb-4 opacity-40">
                <circle cx="40" cy="40" r="36" stroke="#a855f7" strokeWidth="2" strokeDasharray="6 4" />
                <path d="M28 40h24M40 28v24" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <p className="text-gray-600 font-medium">Aucun rendez-vous à venir</p>
              <p className="text-gray-400 text-sm mt-1">Réservez dès maintenant auprès de nos barbiers</p>
              <Link
                href="/booking"
                className="mt-5 inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition"
              >
                Réserver un RDV
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Historique */}
        {past.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Historique</h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              {past.map((appt: any) => (
                <div key={appt.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <Scissors className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{appt.service?.name ?? "Service"}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(appt.date)} · {appt.startTime} · {appt.barber?.name ?? "Barbier"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {appt.service?.price && (
                      <span className="text-sm font-semibold text-gray-700">{formatPrice(appt.service.price)}</span>
                    )}
                    <StatusBadge status={appt.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
