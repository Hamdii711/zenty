"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Scissors, User, CalendarDays, CheckCircle2,
  ArrowLeft, ArrowRight, Clock, Store, AlertCircle, Check
} from "lucide-react"
import { generateTimeSlots, formatPrice } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

interface Service {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
  barberId: string
  barber: { name: string; image: string | null }
}

interface Barber {
  id: string
  name: string
  email: string
  image: string | null
  services: Service[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function nameToGradient(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const h = Math.abs(hash) % 360
  return `linear-gradient(135deg, hsl(${h},65%,55%), hsl(${(h + 50) % 360},70%,45%))`
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

const STEP_META = [
  { label: "Professionnel", icon: Store },
  { label: "Service", icon: Scissors },
  { label: "Date & Heure", icon: CalendarDays },
  { label: "Confirmation", icon: CheckCircle2 },
]

// ─── Composant Stepper ───────────────────────────────────────────────────────

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between mb-8 px-1">
      {STEP_META.map((s, idx) => {
        const n = idx + 1
        const Icon = s.icon
        const done = step > n
        const active = step === n
        return (
          <div key={n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  done
                    ? "bg-purple-600 text-white"
                    : active
                    ? "bg-purple-600 text-white ring-4 ring-purple-100"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  active ? "text-purple-700" : done ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < STEP_META.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-5 sm:mb-0 transition-all ${
                  step > n ? "bg-purple-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

function BookingContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState(1)
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedBarber, setSelectedBarber] = useState<string | null>(searchParams.get("barberId"))
  const [selectedService, setSelectedService] = useState<string | null>(searchParams.get("serviceId"))
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/barbers").then((r) => r.json()),
      fetch("/api/services").then((r) => r.json()),
    ]).then(([b, s]) => {
      setBarbers(Array.isArray(b) ? b : [])
      setServices(Array.isArray(s) ? s : [])
    })
  }, [])

  // Pré-sélection via URL params → avancer à l'étape correspondante
  useEffect(() => {
    if (searchParams.get("barberId") && searchParams.get("serviceId")) {
      setStep(3)
    } else if (searchParams.get("barberId")) {
      setStep(2)
    }
  }, [searchParams])

  const filteredServices = selectedBarber
    ? services.filter((s) => s.barberId === selectedBarber)
    : services

  const selectedServiceObj = services.find((s) => s.id === selectedService)
  const selectedBarberObj = barbers.find((b) => b.id === selectedBarber)

  // Prochains 14 jours
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })

  const timeSlots =
    selectedServiceObj && selectedDate
      ? generateTimeSlots("09:00", "19:00", selectedServiceObj.duration)
      : []

  const todayStr = new Date().toISOString().split("T")[0]

  async function confirmBooking() {
    if (!selectedBarber || !selectedService || !selectedDate || !selectedTime) return
    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent("/booking")}`)
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barberId: selectedBarber,
          serviceId: selectedService,
          date: selectedDate,
          startTime: selectedTime,
          endTime: selectedTime,
        }),
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        alert("Erreur lors de la réservation. Veuillez réessayer.")
      }
    } catch {
      alert("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  // ── Succès ──────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Rendez-vous confirmé !</h1>
          <p className="text-gray-500 mb-2 text-sm">
            {selectedBarberObj?.name} — {selectedServiceObj?.name}
          </p>
          <p className="text-gray-500 mb-6 text-sm">
            {selectedDate
              ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(new Date(selectedDate))
              : ""}{" "}
            à {selectedTime}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition"
            >
              Voir mes rendez-vous
            </button>
            <button
              onClick={() => {
                setSuccess(false)
                setStep(1)
                setSelectedBarber(null)
                setSelectedService(null)
                setSelectedDate("")
                setSelectedTime("")
              }}
              className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Nouvelle réservation
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Réserver un rendez-vous</h1>
        <p className="text-gray-500 text-sm mt-1">Suivez les étapes pour réserver votre créneau.</p>
      </div>

      <Stepper step={step} />

      {/* ── Étape 1 : Choix barbier ─────────────────────────────────────── */}
      {step === 1 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-purple-500" />
            Choisissez un professionnel
          </h2>
          {barbers.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">Chargement...</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {barbers.map((barber) => {
                const isSelected = selectedBarber === barber.id
                return (
                  <button
                    key={barber.id}
                    onClick={() => {
                      setSelectedBarber(barber.id)
                      setSelectedService(null)
                    }}
                    className={`p-4 rounded-2xl border text-left transition group ${
                      isSelected
                        ? "border-purple-500 bg-purple-50 shadow-sm"
                        : "border-gray-200 hover:border-purple-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ background: nameToGradient(barber.name || "B") }}
                      >
                        {barber.image ? (
                          <img src={barber.image} alt={barber.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          getInitials(barber.name || "?")
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{barber.name}</p>
                        <p className="text-sm text-gray-500">
                          {barber.services.length} service{barber.services.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedBarber}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Étape 2 : Choix service ─────────────────────────────────────── */}
      {step === 2 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-purple-500" />
            Choisissez un service
          </h2>
          {filteredServices.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              Aucun service disponible pour ce professionnel.
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredServices.map((service) => {
                const isSelected = selectedService === service.id
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center gap-4 ${
                      isSelected
                        ? "border-purple-500 bg-purple-50 shadow-sm"
                        : "border-gray-200 hover:border-purple-200 bg-white"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{service.name}</p>
                      {service.description && (
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{service.description}</p>
                      )}
                      <span className="inline-flex items-center gap-1 mt-1.5 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        {service.duration} min
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-black text-purple-600">{formatPrice(service.price)}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedService}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Étape 3 : Date & Heure ──────────────────────────────────────── */}
      {step === 3 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-purple-500" />
            Choisissez une date
          </h2>

          {/* Chips dates horizontales */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {days.map((day) => {
              const dateStr = day.toISOString().split("T")[0]
              const isSelected = selectedDate === dateStr
              const isToday = dateStr === todayStr
              const dayName = new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(day)
              const monthName = new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(day)
              return (
                <button
                  key={dateStr}
                  onClick={() => { setSelectedDate(dateStr); setSelectedTime("") }}
                  className={`flex flex-col items-center px-3 py-2.5 rounded-xl border shrink-0 transition min-w-[3.5rem] ${
                    isSelected
                      ? "border-purple-500 bg-purple-600 text-white shadow-sm"
                      : isToday
                      ? "border-purple-200 bg-purple-50 text-purple-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-purple-200"
                  }`}
                >
                  <span className="text-xs font-medium uppercase opacity-80">{dayName.slice(0, 3)}</span>
                  <span className="text-lg font-bold leading-tight">{day.getDate()}</span>
                  <span className="text-xs opacity-70">{monthName}</span>
                  {isToday && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-0.5" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Créneaux horaires */}
          {selectedDate && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-500" />
                Créneaux disponibles
                {selectedServiceObj && (
                  <span className="text-xs text-gray-400 font-normal">
                    · {selectedServiceObj.duration} min par créneau
                  </span>
                )}
              </h3>
              {timeSlots.length === 0 ? (
                <p className="text-sm text-gray-400">Aucun créneau disponible.</p>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {timeSlots.map((time) => {
                    const isSelected = selectedTime === time
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2.5 rounded-xl border text-sm font-medium transition ${
                          isSelected
                            ? "border-purple-500 bg-purple-600 text-white shadow-sm"
                            : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
                        }`}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!selectedTime}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Étape 4 : Récapitulatif ─────────────────────────────────────── */}
      {step === 4 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-purple-500" />
            Récapitulatif
          </h2>

          {/* Card résumé */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-5">
            {/* Header avec gradient barbier */}
            <div
              className="h-16 flex items-center px-5 gap-3"
              style={{ background: nameToGradient(selectedBarberObj?.name || "B") }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {getInitials(selectedBarberObj?.name || "?")}
              </div>
              <div>
                <p className="text-white font-semibold">{selectedBarberObj?.name}</p>
                <p className="text-white/80 text-xs">Barbier professionnel</p>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Scissors className="w-4 h-4" /> Service
                </span>
                <span className="font-semibold text-gray-900">{selectedServiceObj?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Durée
                </span>
                <span className="font-semibold text-gray-900">{selectedServiceObj?.duration} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" /> Date
                </span>
                <span className="font-semibold text-gray-900">
                  {selectedDate
                    ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(selectedDate))
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Heure
                </span>
                <span className="font-semibold text-gray-900">{selectedTime}</span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between items-center text-base">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-black text-purple-600 text-xl">
                  {selectedServiceObj ? formatPrice(selectedServiceObj.price) : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Message si non connecté */}
          {!session && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800">Connexion requise</p>
                <p className="text-amber-700 mt-0.5">
                  Vous devez être connecté pour finaliser votre réservation. Vous serez redirigé vers la page de connexion.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
            <button
              onClick={confirmBooking}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Réservation en cours…
                </>
              ) : session ? (
                <>
                  <Check className="w-4 h-4" />
                  Confirmer la réservation
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Se connecter pour réserver
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}
