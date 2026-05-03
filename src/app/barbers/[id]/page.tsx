"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Scissors, Star, MapPin, Phone, Clock, ArrowRight,
  MessageSquare, User, Info, BadgeCheck, Calendar
} from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface Barber {
  id: string
  name: string
  email: string
  image: string | null
  bio: string | null
  address: string | null
  phone: string | null
  services: {
    id: string
    name: string
    description: string | null
    price: number
    duration: number
  }[]
}

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: { name: string | null }
}

type Tab = "services" | "avis" | "infos"

/** Convertit un nom en couleur HSL déterministe */
function nameToHsl(name: string): { from: string; via: string; to: string } {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h = Math.abs(hash) % 360
  const h2 = (h + 30) % 360
  const h3 = (h + 60) % 360
  return {
    from: `hsl(${h}, 65%, 55%)`,
    via: `hsl(${h2}, 60%, 50%)`,
    to: `hsl(${h3}, 70%, 45%)`,
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Aujourd'hui"
  if (days === 1) return "Hier"
  if (days < 7) return `Il y a ${days} jours`
  if (days < 30) return `Il y a ${Math.floor(days / 7)} semaine${Math.floor(days / 7) > 1 ? "s" : ""}`
  if (days < 365) return `Il y a ${Math.floor(days / 30)} mois`
  return `Il y a ${Math.floor(days / 365)} an${Math.floor(days / 365) > 1 ? "s" : ""}`
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5"
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${cls} ${i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  )
}

export default function BarberProfilePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [barber, setBarber] = useState<Barber | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>("services")

  useEffect(() => {
    Promise.all([
      fetch(`/api/barbers/${id}`).then((r) => r.json()),
      fetch(`/api/reviews?barberId=${id}`).then((r) => r.json()),
    ])
      .then(([b, r]) => {
        setBarber(b)
        setReviews(Array.isArray(r) ? r : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="h-40 bg-gray-100 rounded-2xl animate-pulse mb-4" />
        <div className="h-24 w-24 bg-gray-200 rounded-2xl animate-pulse -mt-12 ml-6 mb-4" />
        <div className="h-7 bg-gray-100 rounded w-48 animate-pulse mb-2 mx-6" />
        <div className="h-4 bg-gray-100 rounded w-64 animate-pulse mx-6" />
      </div>
    )
  }

  if (!barber) {
    return (
      <div className="text-center py-20">
        <Scissors className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Professionnel introuvable</p>
      </div>
    )
  }

  const avgRating =
    reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null
  const colors = nameToHsl(barber.name || "B")
  const initials = getInitials(barber.name || "?")

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "services", label: "Services", icon: <Scissors className="w-4 h-4" /> },
    { id: "avis", label: `Avis${reviews.length ? ` (${reviews.length})` : ""}`, icon: <Star className="w-4 h-4" /> },
    { id: "infos", label: "Infos", icon: <Info className="w-4 h-4" /> },
  ]

  return (
    <div className="max-w-2xl mx-auto pb-28 sm:pb-10">
      {/* Cover avec gradient dynamique */}
      <div
        className="h-44 w-full relative"
        style={{
          background: `linear-gradient(135deg, ${colors.from}, ${colors.via}, ${colors.to})`,
        }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
      </div>

      {/* Header info */}
      <div className="px-4 sm:px-6">
        <div className="flex items-end justify-between -mt-12 mb-4">
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center overflow-hidden text-white font-bold text-2xl select-none"
            style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
          >
            {barber.image ? (
              <img src={barber.image} alt={barber.name ?? ""} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          {/* Bouton réserver desktop */}
          <button
            onClick={() => router.push(`/booking?barberId=${barber.id}`)}
            className="hidden sm:flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition shadow-md shadow-purple-200"
          >
            Réserver <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Nom + badge */}
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">{barber.name}</h1>
          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            <BadgeCheck className="w-3.5 h-3.5" />
            Barbier professionnel
          </span>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mt-2 mb-4">
          {avgRating !== null && (
            <div className="flex items-center gap-1.5">
              <StarRating rating={Math.round(avgRating)} size="md" />
              <span className="text-sm font-semibold text-gray-700">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-gray-400">({reviews.length} avis)</span>
            </div>
          )}
          {barber.address && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{barber.address}</span>
            </div>
          )}
          {barber.phone && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{barber.phone}</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 mb-6 gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
                activeTab === t.id
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Services */}
        {activeTab === "services" && (
          <div className="space-y-3">
            {barber.services.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400 text-sm">
                <Scissors className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                Aucun service disponible pour le moment
              </div>
            ) : (
              barber.services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-purple-200 hover:shadow-sm transition group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{service.description}</p>
                      )}
                      <div className="flex items-center gap-1 mt-2">
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" />
                          {service.duration} min
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-purple-600">{formatPrice(service.price)}</p>
                      <button
                        onClick={() =>
                          router.push(`/booking?barberId=${barber.id}&serviceId=${service.id}`)
                        }
                        className="mt-2 inline-flex items-center gap-1 bg-purple-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-purple-700 transition"
                      >
                        Réserver ce service
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Avis */}
        {activeTab === "avis" && (
          <div>
            {reviews.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Aucun avis pour l&#39;instant</p>
                <p className="text-xs text-gray-400 mt-1">Soyez le premier à laisser un avis</p>
              </div>
            ) : (
              <>
                {/* Agrégat rating */}
                {avgRating !== null && (
                  <div className="bg-purple-50 rounded-2xl p-5 mb-5 flex items-center gap-5">
                    <div className="text-center">
                      <p className="text-4xl font-black text-purple-700">{avgRating.toFixed(1)}</p>
                      <StarRating rating={Math.round(avgRating)} size="md" />
                      <p className="text-xs text-gray-400 mt-1">{reviews.length} avis</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter((r) => r.rating === star).length
                        const pct = reviews.length ? (count / reviews.length) * 100 : 0
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-3">{star}</span>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 w-4">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  {reviews.map((review) => {
                    const name = review.user.name || "Client"
                    const ini = getInitials(name)
                    return (
                      <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${nameToHsl(name).from}, ${nameToHsl(name).to})`,
                            }}
                          >
                            {ini}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="font-semibold text-sm text-gray-900">{name}</span>
                              <span className="text-xs text-gray-400">{timeAgo(review.createdAt)}</span>
                            </div>
                            <StarRating rating={review.rating} />
                            {review.comment && (
                              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab: Infos */}
        {activeTab === "infos" && (
          <div className="space-y-4">
            {barber.bio && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" />
                  À propos
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{barber.bio}</p>
              </div>
            )}

            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                Horaires d&#39;ouverture
              </h3>
              <div className="space-y-2 text-sm">
                {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map(
                  (day, i) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-gray-600">{day}</span>
                      <span className={`font-medium ${i === 6 ? "text-gray-400" : "text-gray-900"}`}>
                        {i === 6 ? "Fermé" : "09:00 – 19:00"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-500" />
                Coordonnées
              </h3>
              <div className="space-y-2.5 text-sm">
                {barber.address && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <span>{barber.address}</span>
                  </div>
                )}
                {barber.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <a href={`tel:${barber.phone}`} className="hover:text-purple-600 transition">
                      {barber.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bouton sticky mobile */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-gray-100 p-4 z-50">
        <button
          onClick={() => router.push(`/booking?barberId=${barber.id}`)}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-purple-700 transition shadow-lg shadow-purple-200"
        >
          Réserver un créneau
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
