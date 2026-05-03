import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Badge, StatusBadge } from "@/components/ui/Badge"

describe("Badge component", () => {
  it("affiche le texte des enfants", () => {
    render(<Badge>Mon badge</Badge>)
    expect(screen.getByText("Mon badge")).toBeInTheDocument()
  })

  it("applique la classe 'badge' par défaut", () => {
    render(<Badge>Test</Badge>)
    const el = screen.getByText("Test")
    expect(el.className).toContain("badge")
  })

  it("applique badge-pending pour le statut PENDING", () => {
    render(<Badge status="PENDING">En attente</Badge>)
    const el = screen.getByText("En attente")
    expect(el.className).toContain("badge-pending")
  })

  it("applique badge-confirmed pour le statut CONFIRMED", () => {
    render(<Badge status="CONFIRMED">Confirmé</Badge>)
    const el = screen.getByText("Confirmé")
    expect(el.className).toContain("badge-confirmed")
  })

  it("applique badge-cancelled pour le statut CANCELLED", () => {
    render(<Badge status="CANCELLED">Annulé</Badge>)
    const el = screen.getByText("Annulé")
    expect(el.className).toContain("badge-cancelled")
  })

  it("applique badge-completed pour le statut COMPLETED", () => {
    render(<Badge status="COMPLETED">Terminé</Badge>)
    const el = screen.getByText("Terminé")
    expect(el.className).toContain("badge-completed")
  })

  it("accepte une className supplémentaire", () => {
    render(<Badge className="extra-class">Test</Badge>)
    const el = screen.getByText("Test")
    expect(el.className).toContain("extra-class")
  })
})

describe("StatusBadge component", () => {
  it("affiche le label 'En attente' pour PENDING", () => {
    render(<StatusBadge status="PENDING" />)
    expect(screen.getByText("En attente")).toBeInTheDocument()
  })

  it("affiche le label 'Confirmé' pour CONFIRMED", () => {
    render(<StatusBadge status="CONFIRMED" />)
    expect(screen.getByText("Confirmé")).toBeInTheDocument()
  })

  it("affiche le label 'Annulé' pour CANCELLED", () => {
    render(<StatusBadge status="CANCELLED" />)
    expect(screen.getByText("Annulé")).toBeInTheDocument()
  })

  it("affiche le label 'Terminé' pour COMPLETED", () => {
    render(<StatusBadge status="COMPLETED" />)
    expect(screen.getByText("Terminé")).toBeInTheDocument()
  })
})
