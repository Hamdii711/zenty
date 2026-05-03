"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Check, X } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface Service {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
  isActive: boolean
}

interface ServiceForm {
  name: string
  description: string
  duration: string
  price: string
}

const empty: ServiceForm = { name: "", description: "", duration: "30", price: "" }

export default function BarberServicesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<ServiceForm>(empty)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login")
  }, [status, router])

  const barberId = (session?.user as any)?.id

  useEffect(() => {
    if (!barberId) return
    fetch(`/api/services?barberId=${barberId}`)
      .then((r) => r.json())
      .then(setServices)
  }, [barberId])

  async function handleSave() {
    if (!form.name || !form.price || !form.duration) {
      setError("Nom, durée et prix sont requis")
      return
    }
    setLoading(true)
    setError("")
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        duration: parseInt(form.duration),
        price: parseFloat(form.price),
        barberId,
      }

      if (editId) {
        const res = await fetch(`/api/services/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const updated = await res.json()
        setServices((prev) => prev.map((s) => (s.id === editId ? updated : s)))
      } else {
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const created = await res.json()
        setServices((prev) => [...prev, created])
      }

      setForm(empty)
      setEditId(null)
      setShowForm(false)
    } catch {
      setError("Erreur lors de la sauvegarde")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce service ?")) return
    await fetch(`/api/services/${id}`, { method: "DELETE" })
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  function startEdit(service: Service) {
    setForm({
      name: service.name,
      description: service.description || "",
      duration: service.duration.toString(),
      price: service.price.toString(),
    })
    setEditId(service.id)
    setShowForm(true)
  }

  if (status === "loading") return <div className="flex justify-center p-8">Chargement…</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes services</h1>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(empty) }}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          <Plus className="w-4 h-4" />
          Nouveau service
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-purple-100 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">
            {editId ? "Modifier le service" : "Ajouter un service"}
          </h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Coupe homme"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description optionnelle"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min) *</label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                min="5"
                step="5"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                min="0"
                step="0.5"
                placeholder="Ex: 25"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {loading ? "Sauvegarde…" : "Enregistrer"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditId(null); setError("") }}
              className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {services.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">Aucun service. Ajoutez-en un !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:border-purple-100 transition"
            >
              <div>
                <h3 className="font-medium text-gray-900">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-gray-500">{service.description}</p>
                )}
                <p className="text-sm text-gray-400">{service.duration} min</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-purple-600">{formatPrice(service.price)}</span>
                <button
                  onClick={() => startEdit(service)}
                  className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
