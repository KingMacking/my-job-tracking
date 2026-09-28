import { useState, useEffect, useRef } from "react"
import type { Offer, OfferInput, OfferStatus, Interaction } from "@/types"
import { STATUS_OPTIONS } from "@/types"
import { X, Loader2 } from "lucide-react"
import { InteractionLog } from "@/components/InteractionLog"

interface OfferFormProps {
  offer?: Offer | null
  onSave: (data: OfferInput) => Promise<void>
  onClose: () => void
}

const emptyForm: OfferInput = {
  title: "",
  company: "",
  salary: 0,
  benefits: 0,
  availability_hours: 40,
  experience_years: 0,
  team_size: 1,
  contract_months: 0,
  status: "pendiente",
  notes: "",
  url: "",
  interactions: [],
}

export function OfferForm({ offer, onSave, onClose }: OfferFormProps) {
  const [form, setForm] = useState<OfferInput>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  useEffect(() => {
    if (offer) {
      setForm({
        title: offer.title,
        company: offer.company,
        salary: offer.salary,
        benefits: offer.benefits,
        availability_hours: offer.availability_hours,
        experience_years: offer.experience_years,
        team_size: offer.team_size,
        contract_months: offer.contract_months,
        status: offer.status,
        notes: offer.notes,
        url: offer.url,
        interactions: offer.interactions ?? [],
      })
    }
  }, [offer])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await onSave(form)
    } catch (err) {
      setError("No se pudo guardar. Intentá de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  const update = (field: keyof OfferInput, value: string | number | Interaction[]) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const inputClass =
    "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 min-h-[44px] text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none focus-visible:border-zinc-600 transition-colors duration-150"

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={offer ? "Editar oferta" : "Agregar oferta"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-t-xl sm:rounded-xl w-full max-w-lg max-h-[85dvh] sm:max-h-[90dvh] overflow-y-auto overscroll-behavior-contain pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100 text-balance">
            {offer ? "Editar oferta" : "Agregar oferta"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar formulario"
            className="text-zinc-400 hover:text-zinc-200 transition-colors duration-150 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4" noValidate>
          <div className="space-y-1">
            <label htmlFor="offer-title" className="text-sm text-zinc-400">
              Título <span aria-hidden="true">*</span>
            </label>
            <input
              ref={titleRef}
              id="offer-title"
              type="text"
              name="title"
              required
              autoComplete="off"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Ej: Dev Senior Frontend"
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="offer-company" className="text-sm text-zinc-400">
              Empresa
            </label>
            <input
              id="offer-company"
              type="text"
              name="company"
              autoComplete="off"
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              placeholder="Ej: Mercado Libre"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="offer-salary" className="text-sm text-zinc-400">
                Salario (ARS) <span aria-hidden="true">*</span>
              </label>
              <input
                id="offer-salary"
                type="number"
                name="salary"
                required
                min={0}
                inputMode="numeric"
                value={form.salary || ""}
                onChange={(e) => update("salary", Number(e.target.value))}
                placeholder="0"
                className={`${inputClass} tabular-nums`}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="offer-benefits" className="text-sm text-zinc-400">
                Bonus (ARS)
              </label>
              <input
                id="offer-benefits"
                type="number"
                name="benefits"
                min={0}
                inputMode="numeric"
                value={form.benefits || ""}
                onChange={(e) => update("benefits", Number(e.target.value))}
                placeholder="0"
                className={`${inputClass} tabular-nums`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label htmlFor="offer-availability-hours" className="text-sm text-zinc-400">
                Hs/semana
              </label>
              <input
                id="offer-availability-hours"
                type="number"
                name="availability_hours"
                min={1}
                inputMode="numeric"
                value={form.availability_hours}
                onChange={(e) => update("availability_hours", Number(e.target.value))}
                className={`${inputClass} tabular-nums`}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="offer-experience-years" className="text-sm text-zinc-400">
                Años exp
              </label>
              <input
                id="offer-experience-years"
                type="number"
                name="experience_years"
                min={0}
                inputMode="numeric"
                value={form.experience_years}
                onChange={(e) => update("experience_years", Number(e.target.value))}
                className={`${inputClass} tabular-nums`}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="offer-team-size" className="text-sm text-zinc-400">
                Equipo
              </label>
              <input
                id="offer-team-size"
                type="number"
                name="team_size"
                min={1}
                inputMode="numeric"
                value={form.team_size}
                onChange={(e) => update("team_size", Number(e.target.value))}
                className={`${inputClass} tabular-nums`}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="offer-contract-months" className="text-sm text-zinc-400">
                Meses
              </label>
              <input
                id="offer-contract-months"
                type="number"
                name="contract_months"
                min={0}
                inputMode="numeric"
                value={form.contract_months || ""}
                onChange={(e) => update("contract_months", Number(e.target.value))}
                placeholder="0"
                className={`${inputClass} tabular-nums`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-sm text-zinc-400" id="offer-status-label">Estado</span>
            <div className="flex gap-2 flex-wrap" role="radiogroup" aria-labelledby="offer-status-label">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={form.status === s.value}
                  onClick={() => update("status", s.value as OfferStatus)}
                  className={`text-xs font-medium px-3 py-2 min-h-[36px] rounded-full border transition-colors duration-150 touch-manipulation ${
                    form.status === s.value
                      ? `${s.color} text-white border-transparent`
                      : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="offer-url" className="text-sm text-zinc-400">
              Link de la oferta
            </label>
            <input
              id="offer-url"
              type="url"
              name="url"
              autoComplete="off"
              value={form.url}
              onChange={(e) => update("url", e.target.value)}
              placeholder="https://…"
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="offer-notes" className="text-sm text-zinc-400">
              Notas
            </label>
            <textarea
              id="offer-notes"
              name="notes"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Qué te atrae del puesto, qué piden, detalles del equipo…"
              rows={3}
              className={`${inputClass} resize-none min-h-[80px]`}
            />
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <InteractionLog
              interactions={form.interactions}
              onChange={(interactions: Interaction[]) => update("interactions", interactions)}
            />
          </div>

          {error && (
            <div role="alert" className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2.5 min-h-[44px] text-sm text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors duration-150 disabled:opacity-50 touch-manipulation"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 min-h-[44px] text-sm font-medium text-zinc-900 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors duration-150 disabled:opacity-50 flex items-center justify-center gap-2 touch-manipulation"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Guardando…
                </>
              ) : offer ? (
                "Guardar cambios"
              ) : (
                "Agregar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
