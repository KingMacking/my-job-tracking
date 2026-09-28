import type { Offer, OfferStatus } from "@/types"
import { STATUS_OPTIONS } from "@/types"
import { Pencil, Trash2, ExternalLink, Clock, Users, GraduationCap, DollarSign, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface OfferCardProps {
  offer: Offer
  onEdit: (offer: Offer) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: OfferStatus) => void
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMin / 60)
  const diffD = Math.floor(diffH / 24)

  if (diffMin < 1) return "ahora"
  if (diffMin < 60) return `hace ${diffMin}m`
  if (diffH < 24) return `hace ${diffH}h`
  if (diffD < 7) return `hace ${diffD}d`
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" })
}

export function OfferCard({ offer, onEdit, onDelete, onStatusChange }: OfferCardProps) {
  const status = STATUS_OPTIONS.find((s) => s.value === offer.status)
  const interactions = offer.interactions ?? []
  const lastInteraction = interactions.length > 0
    ? [...interactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(amount)

  return (
    <article className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 sm:p-4 space-y-2.5 sm:space-y-3 hover:border-zinc-700 transition-colors duration-200 overflow-hidden">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-100 truncate text-balance">{offer.title}</h3>
          <p className="text-sm text-zinc-400 truncate">{offer.company}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <label htmlFor={`status-${offer.id}`} className="sr-only">
            Estado de {offer.title}
          </label>
          <select
            id={`status-${offer.id}`}
            name={`status-${offer.id}`}
            value={offer.status}
            onChange={(e) => onStatusChange(offer.id, e.target.value as OfferStatus)}
            aria-label={`Estado de ${offer.title}`}
            className={cn(
              "text-xs font-medium px-2.5 py-1.5 min-h-[36px] rounded-full border-0 text-white cursor-pointer bg-zinc-800",
              status?.color
            )}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-300">
        <div className="flex items-center gap-1 min-w-0">
          <DollarSign className="w-4 h-4 text-zinc-500 shrink-0" aria-hidden="true" />
          <span className="font-semibold tabular-nums truncate">{formatCurrency(offer.salary)}</span>
          {offer.benefits > 0 && (
            <span className="text-zinc-500 text-xs tabular-nums">+&nbsp;{formatCurrency(offer.benefits)}&nbsp;bônus</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="tabular-nums">{offer.availability_hours}&nbsp;hs/sem</span>
        </div>
        <div className="flex items-center gap-1">
          <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="tabular-nums">{offer.experience_years}&nbsp;años exp</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="tabular-nums">{offer.team_size}&nbsp;personas</span>
        </div>
      </div>

      {interactions.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
          <span>
            {interactions.length}&nbsp;{interactions.length === 1 ? "interacción" : "interacciones"}
          </span>
          {lastInteraction && (
            <span className="text-zinc-600">·&nbsp;{timeAgo(lastInteraction.date)}</span>
          )}
        </div>
      )}

      {offer.notes && (
        <p className="text-xs text-zinc-500 line-clamp-2 border-t border-zinc-800 pt-2 break-words">{offer.notes}</p>
      )}

      <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-zinc-800">
        <button
          onClick={() => onEdit(offer)}
          aria-label={`Editar ${offer.title}`}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors duration-150 px-3 py-2 min-h-[36px] rounded hover:bg-zinc-800 touch-manipulation"
        >
          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
          Editar
        </button>
        <button
          onClick={() => onDelete(offer.id)}
          aria-label={`Eliminar ${offer.title}`}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 transition-colors duration-150 px-3 py-2 min-h-[36px] rounded hover:bg-zinc-800 touch-manipulation"
        >
          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          Eliminar
        </button>
        {offer.url && (
          <a
            href={offer.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir la oferta de ${offer.title}`}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-blue-400 transition-colors duration-150 px-3 py-2 min-h-[36px] rounded hover:bg-zinc-800 ml-auto touch-manipulation"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            Oferta
          </a>
        )}
      </div>
    </article>
  )
}
