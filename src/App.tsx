import { useState, useMemo, useEffect, useCallback } from "react"
import type { Offer, OfferInput, OfferStatus } from "@/types"
import { supabase } from "@/lib/supabase"
import { OfferCard } from "@/components/OfferCard"
import { OfferForm } from "@/components/OfferForm"
import { OfferFilters } from "@/components/OfferFilters"
import { Plus, Briefcase, Loader2, X, AlertTriangle } from "lucide-react"

function getFiltersFromURL(): { search: string; status: OfferStatus | "todos" } {
  const params = new URLSearchParams(window.location.search)
  const search = params.get("q") ?? ""
  const status = (params.get("status") as OfferStatus | "todos") ?? "todos"
  return { search, status }
}

function setFiltersToURL(search: string, status: OfferStatus | "todos") {
  const params = new URLSearchParams()
  if (search) params.set("q", search)
  if (status !== "todos") params.set("status", status)
  const qs = params.toString()
  const url = qs ? `?${qs}` : window.location.pathname
  window.history.replaceState(null, "", url)
}

export default function App() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Offer | null>(null)
  const [deleting, setDeleting] = useState<Offer | null>(null)
  const [search, setSearch] = useState(() => getFiltersFromURL().search)
  const [statusFilter, setStatusFilter] = useState<OfferStatus | "todos">(
    () => getFiltersFromURL().status
  )

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    setFetchError(null)
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      setFetchError("No se pudieron cargar las ofertas. Revisá tu conexión.")
    } else if (data) {
      setOffers(data as Offer[])
    }
    setLoading(false)
  }

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setFiltersToURL(value, statusFilter)
  }, [statusFilter])

  const handleStatusFilterChange = useCallback((value: OfferStatus | "todos") => {
    setStatusFilter(value)
    setFiltersToURL(search, value)
  }, [search])

  const handleSave = async (data: OfferInput) => {
    const now = new Date().toISOString()
    if (editing) {
      const { error } = await supabase
        .from("offers")
        .update({ ...data, updated_at: now })
        .eq("id", editing.id)

      if (error) throw error
      setOffers((prev) =>
        prev.map((o) => (o.id === editing.id ? { ...o, ...data, updated_at: now } : o))
      )
    } else {
      const { data: inserted, error } = await supabase
        .from("offers")
        .insert({ ...data, created_at: now, updated_at: now })
        .select()
        .single()

      if (error) throw error
      if (inserted) {
        setOffers((prev) => [inserted as Offer, ...prev])
      }
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = async () => {
    if (!deleting) return
    const { error } = await supabase.from("offers").delete().eq("id", deleting.id)
    if (!error) {
      setOffers((prev) => prev.filter((o) => o.id !== deleting.id))
    }
    setDeleting(null)
  }

  const handleStatusChange = async (id: string, status: OfferStatus) => {
    const now = new Date().toISOString()
    const { error } = await supabase
      .from("offers")
      .update({ status, updated_at: now })
      .eq("id", id)

    if (!error) {
      setOffers((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status, updated_at: now } : o))
      )
    }
  }

  const handleEdit = (offer: Offer) => {
    setEditing(offer)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditing(null)
  }

  const filtered = useMemo(() => {
    return offers.filter((o) => {
      const matchesSearch =
        !search ||
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        o.company.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "todos" || o.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [offers, search, statusFilter])

  const stats = useMemo(() => {
    const total = offers.length
    const withOffer = offers.filter((o) => o.status === "oferta").length
    const interviewing = offers.filter((o) => o.status === "entrevista").length
    return { total, withOffer, interviewing }
  }, [offers])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3 safe-area">
        <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" aria-hidden="true" />
        <p className="text-sm text-zinc-500" aria-live="polite">Cargando ofertas…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 safe-area">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <header className="flex items-start sm:items-center justify-between gap-3 mb-8">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 flex items-center gap-2 text-balance">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" aria-hidden="true" />
              <span className="truncate">Job Tracker</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 tabular-nums" aria-live="polite">
              {stats.total}&nbsp;ofertas
              {stats.withOffer > 0 && <> · {stats.withOffer}&nbsp;con oferta</>}
              {stats.interviewing > 0 && <> · {stats.interviewing}&nbsp;en entrevista</>}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="shrink-0 flex items-center gap-2 bg-zinc-100 text-zinc-900 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors duration-150 touch-manipulation"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Agregar
          </button>
        </header>

        {fetchError && (
          <div role="alert" className="mb-6 text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-4 py-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
            {fetchError}
            <button onClick={fetchOffers} className="ml-auto underline hover:no-underline">
              Reintentar
            </button>
          </div>
        )}

        <div className="mb-6">
          <OfferFilters
            search={search}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20" role="status">
            <Briefcase className="w-12 h-12 text-zinc-700 mx-auto mb-4" aria-hidden="true" />
            <p className="text-zinc-500 text-sm">
              {offers.length === 0
                ? "No tenés ofertas guardadas. ¡Agregá una!"
                : "No se encontraron ofertas con esos filtros."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onEdit={handleEdit}
                onDelete={(id) => {
                  const match = offers.find((o) => o.id === id)
                  if (match) setDeleting(match)
                }}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <OfferForm offer={editing} onSave={handleSave} onClose={handleCloseForm} />
      )}

      {deleting && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar eliminación"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleting(null)
          }}
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-t-xl sm:rounded-xl w-full max-w-sm p-6 text-center">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">¿Eliminar oferta?</h2>
            <p className="text-sm text-zinc-400 mb-6">
              Se eliminará <strong className="text-zinc-200">{deleting.title}</strong>. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleting(null)}
                className="flex-1 px-4 py-2.5 min-h-[44px] text-sm text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors duration-150 touch-manipulation"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 min-h-[44px] text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 transition-colors duration-150 touch-manipulation"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
