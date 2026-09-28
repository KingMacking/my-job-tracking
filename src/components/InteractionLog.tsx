import { useState } from "react"
import type { Interaction, InteractionType } from "@/types"
import { INTERACTION_TYPE_OPTIONS } from "@/types"
import { Plus, Trash2, MessageSquare } from "lucide-react"

interface InteractionLogProps {
  interactions: Interaction[]
  onChange: (interactions: Interaction[]) => void
}

function generateId() {
  return crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2)
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

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function InteractionLog({ interactions, onChange }: InteractionLogProps) {
  const [adding, setAdding] = useState(false)
  const [newType, setNewType] = useState<InteractionType>("llamada")
  const [newNotes, setNewNotes] = useState("")

  const sorted = [...interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const handleAdd = () => {
    if (!newNotes.trim()) return
    const interaction: Interaction = {
      id: generateId(),
      type: newType,
      notes: newNotes.trim(),
      date: new Date().toISOString(),
    }
    onChange([...interactions, interaction])
    setNewNotes("")
    setNewType("llamada")
    setAdding(false)
  }

  const handleDelete = (id: string) => {
    onChange(interactions.filter((i) => i.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleAdd()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-400 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4" aria-hidden="true" />
          Interacciones
          {interactions.length > 0 && (
            <span className="text-zinc-600">({interactions.length})</span>
          )}
        </span>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors duration-150 flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 touch-manipulation"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Agregar
          </button>
        )}
      </div>

      {adding && (
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 space-y-2.5">
          <div className="flex gap-2 flex-wrap">
            {INTERACTION_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setNewType(opt.value)}
                className={`text-xs font-medium px-2.5 py-1.5 min-h-[32px] rounded-full border transition-colors duration-150 touch-manipulation ${
                  newType === opt.value
                    ? "bg-zinc-200 text-zinc-900 border-transparent"
                    : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500"
                }`}
              >
                {opt.icon}&nbsp;{opt.label}
              </button>
            ))}
          </div>
          <textarea
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Qué hablaste, qué te dijeron…"
            rows={2}
            autoFocus
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none resize-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setAdding(false); setNewNotes("") }}
              className="px-3 py-1.5 text-xs text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors duration-150 touch-manipulation"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newNotes.trim()}
              className="px-3 py-1.5 text-xs font-medium text-zinc-900 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors duration-150 disabled:opacity-40 touch-manipulation"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {sorted.length > 0 && (
        <div className="space-y-0">
          {sorted.map((interaction, idx) => {
            const typeOpt = INTERACTION_TYPE_OPTIONS.find((t) => t.value === interaction.type)
            const isLast = idx === sorted.length - 1
            return (
              <div key={interaction.id} className="flex gap-3 relative">
                {!isLast && (
                  <div className="absolute left-[7px] top-6 bottom-0 w-px bg-zinc-800" />
                )}
                <div className="shrink-0 mt-1">
                  <div className="w-[15px] h-[15px] rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <span className="text-[10px]" aria-hidden="true">{typeOpt?.icon}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-zinc-300">
                      {typeOpt?.label}
                    </span>
                    <span className="text-[11px] text-zinc-600 tabular-nums">
                      {formatDateTime(interaction.date)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(interaction.id)}
                      aria-label={`Eliminar interacción del ${formatDateTime(interaction.date)}`}
                      className="ml-auto text-zinc-600 hover:text-red-400 transition-colors duration-150 p-1 touch-manipulation"
                    >
                      <Trash2 className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                  <p className="text-sm text-zinc-400 mt-0.5 break-words">{interaction.notes}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {interactions.length === 0 && !adding && (
        <p className="text-xs text-zinc-600 text-center py-2">
          Sin interacciones registradas
        </p>
      )}
    </div>
  )
}
