import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextResponse } from "next/server"

// Mock next-auth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}))

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  default: {
    appointment: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}))

// Mock authOptions
vi.mock("../app/api/auth/[...nextauth]/route", () => ({
  authOptions: {},
}))

import { getServerSession } from "next-auth"
import { GET, POST } from "../app/api/appointments/route"

const mockedGetServerSession = vi.mocked(getServerSession)

describe("API /api/appointments", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("GET", () => {
    it("retourne 401 si pas de session", async () => {
      mockedGetServerSession.mockResolvedValue(null)

      const req = new Request("http://localhost/api/appointments")
      const response = await GET(req)

      expect(response.status).toBe(401)
      const body = await response.json()
      expect(body.error).toBe("Non autorisé")
    })

    it("retourne 200 avec une session valide (BARBER)", async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { id: "barber-1", role: "BARBER", name: "Test Barber", email: "barber@test.com" },
        expires: "9999-12-31",
      })

      const { default: prisma } = await import("@/lib/prisma")
      vi.mocked(prisma.appointment.findMany).mockResolvedValue([])

      const req = new Request("http://localhost/api/appointments")
      const response = await GET(req)

      expect(response.status).toBe(200)
    })
  })

  describe("POST", () => {
    it("retourne 401 si pas de session", async () => {
      mockedGetServerSession.mockResolvedValue(null)

      const req = new Request("http://localhost/api/appointments", {
        method: "POST",
        body: JSON.stringify({ barberId: "b1", serviceId: "s1", date: "2026-01-15", startTime: "09:00" }),
        headers: { "Content-Type": "application/json" },
      })
      const response = await POST(req)

      expect(response.status).toBe(401)
    })

    it("retourne 400 si barberId manquant", async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { id: "user-1", role: "CLIENT", name: "Test User", email: "user@test.com" },
        expires: "9999-12-31",
      })

      const req = new Request("http://localhost/api/appointments", {
        method: "POST",
        body: JSON.stringify({ serviceId: "s1", date: "2026-01-15", startTime: "09:00" }),
        headers: { "Content-Type": "application/json" },
      })
      const response = await POST(req)

      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body.error).toContain("manquants")
    })

    it("retourne 400 si serviceId manquant", async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { id: "user-1", role: "CLIENT", name: "Test User", email: "user@test.com" },
        expires: "9999-12-31",
      })

      const req = new Request("http://localhost/api/appointments", {
        method: "POST",
        body: JSON.stringify({ barberId: "b1", date: "2026-01-15", startTime: "09:00" }),
        headers: { "Content-Type": "application/json" },
      })
      const response = await POST(req)

      expect(response.status).toBe(400)
    })

    it("retourne 409 si le créneau est déjà pris", async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { id: "user-1", role: "CLIENT", name: "Test User", email: "user@test.com" },
        expires: "9999-12-31",
      })

      const { default: prisma } = await import("@/lib/prisma")
      vi.mocked(prisma.appointment.findFirst).mockResolvedValue({
        id: "existing",
        userId: "user-2",
        barberId: "b1",
        serviceId: "s1",
        date: new Date("2026-01-15"),
        startTime: "09:00",
        endTime: "09:30",
        status: "CONFIRMED",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const req = new Request("http://localhost/api/appointments", {
        method: "POST",
        body: JSON.stringify({ barberId: "b1", serviceId: "s1", date: "2026-01-15", startTime: "09:00" }),
        headers: { "Content-Type": "application/json" },
      })
      const response = await POST(req)

      expect(response.status).toBe(409)
    })
  })
})
