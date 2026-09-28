export type OfferStatus = "pendiente" | "postulada" | "entrevista" | "oferta" | "descartada"

export type InteractionType = "llamada" | "whatsapp" | "email" | "entrevista" | "otro"

export interface Interaction {
  id: string
  type: InteractionType
  notes: string
  date: string
}

export interface Offer {
  id: string
  title: string
  company: string
  salary: number
  benefits: number
  availability_hours: number
  experience_years: number
  contract_months: number
  team_size: number
  status: OfferStatus
  notes: string
  url: string
  interactions: Interaction[]
  created_at: string
  updated_at: string
}

export type OfferInput = Omit<Offer, "id" | "created_at" | "updated_at">

export const STATUS_OPTIONS: { value: OfferStatus; label: string; color: string }[] = [
  { value: "pendiente", label: "Pendiente", color: "bg-slate-500" },
  { value: "postulada", label: "Postulada", color: "bg-blue-500" },
  { value: "entrevista", label: "Entrevista", color: "bg-amber-500" },
  { value: "oferta", label: "Oferta", color: "bg-emerald-500" },
  { value: "descartada", label: "Descartada", color: "bg-red-500" },
]

export const INTERACTION_TYPE_OPTIONS: { value: InteractionType; label: string; icon: string }[] = [
  { value: "llamada", label: "Llamada", icon: "📞" },
  { value: "whatsapp", label: "WhatsApp", icon: "💬" },
  { value: "email", label: "Email", icon: "✉️" },
  { value: "entrevista", label: "Entrevista", icon: "🎤" },
  { value: "otro", label: "Otro", icon: "📝" },
]
