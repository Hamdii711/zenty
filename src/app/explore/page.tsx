"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Scissors, SlidersHorizontal } from "lucide-react"
import { BarberCard } from "@/components/ui/Card"

interface Barber {
  id: string
  name: string
  email: string
  image: string | null
  bio: string | null
  address: string | null
  phone: string | null
  services: { id: string; name: string; price: number; duration: number }[]
  _count?: { barberReviews: number }
  avgRating?: number
}

const FILTERS = [
  { id: "all", label: "Tous" },
  { id: "coiffeur", label: "Coiffeur" },
  { id: "barbier", label: "Barbier" },
  { id: "coloration", label: "Coloration" },
  { id: "soin", label: "Soin" },
]

export default function ExplorePage() {
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/barbers")
      .then((r) => r.json())
      .then((data) => {
        setBarbers(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return barbers.filter((b) => {
      const matchSearch =
        !q ||
        b.name?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q) ||
        b.services?.some((s) => s.name.toLowerCase().includes(q))

      const matchFilter =
        filter === "all" ||
        b.services?.some((s) => s.name.toLowerCase().includes(filter)) ||
        b.bio?.toLowerCase().includes(filter)

      return matchSearch && matchFilter
    })
  }, [barbers, search, filter])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <span className="badge badge-brand mb-3">Explorer</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Trouvez votre <span className="gradient-text">pro idéal</span>
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Coiffeurs, barbiers et instituts près de chez vous.
        </p>
      </div>

      {/* Big search bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative card p-1.5 flex items-center gap-1 shadow-card">
          <div className="flex items-center flex-1 gap-2 pl-3">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom, ville ou service…"
              className="flex-1 py-3 pr-2 bg-transparent text-sm outline-none"
            />
          </div>
          <button className="btn btn-primary btn-md">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
          </button>
        </div>
      </div>

      {/* Chips */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`chip ${filter === f.id ? "chip-active" : ""}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="h-32 skeleton" />
              <div className="p-5 pt-10 space-y-3">
                <div className="h-4 w-1/2 rounded skeleton" />
                <div className="h-3 w-3/4 rounded skeleton" />
                <div className="h-3 w-2/3 rounded skeleton" />
                <div className="h-3 w-1/2 rounded skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center mb-4">
            <Scissors className="w-10 h-10 text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Aucun résultat</h3>
          <p className="text-gray-500 mt-1 max-w-sm mx-auto">
            Essayez d'autres mots-clés ou supprimez les filtres pour élargir la recherche.
          </p>
          {(search || filter !== "all") && (
            <button
              className="btn btn-secondary btn-md mt-4"
              onClick={() => {
                setSearch("")
                setFilter("all")
              }}
            >
              Réinitialiser
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {filtered.map((barber) => (
            <BarberCard key={barber.id} barber={barber} />
          ))}
        </div>
      )}
    </div>
  )
}
