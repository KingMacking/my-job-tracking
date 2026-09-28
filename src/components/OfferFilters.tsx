import type { OfferStatus } from "@/types"
import { STATUS_OPTIONS } from "@/types"
import { Search, X } from "lucide-react"

interface OfferFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: OfferStatus | "todos"
  onStatusFilterChange: (value: OfferStatus | "todos") => void
}

export function OfferFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: OfferFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
        <label htmlFor="offer-search" className="sr-only">
          Buscar ofertas
        </label>
        <input
          id="offer-search"
          type="search"
          name="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por empresa o puesto…"
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-8 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none focus-visible:border-zinc-600 transition-colors duration-150"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            aria-label="Limpiar búsqueda"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors duration-150 p-2 min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1"
        role="group"
        aria-label="Filtrar por estado"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <button
          onClick={() => onStatusFilterChange("todos")}
          aria-pressed={statusFilter === "todos"}
          className={`text-xs font-medium px-3 py-2 min-h-[36px] rounded-lg border transition-colors duration-150 whitespace-nowrap touch-manipulation ${
            statusFilter === "todos"
              ? "bg-zinc-100 text-zinc-900 border-transparent"
              : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-700"
          }`}
        >
          Todos
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => onStatusFilterChange(s.value)}
            aria-pressed={statusFilter === s.value}
            className={`text-xs font-medium px-3 py-2 min-h-[36px] rounded-lg border transition-colors duration-150 whitespace-nowrap touch-manipulation ${
              statusFilter === s.value
                ? `${s.color} text-white border-transparent`
                : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
