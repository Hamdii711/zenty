import { describe, it, expect } from "vitest"
import { generateTimeSlots } from "@/lib/utils"

// Logique métier de filtrage des créneaux passés (simulée ici en pur)
function filterPastSlots(slots: string[], date: Date, now: Date): string[] {
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (!isToday) return slots

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  return slots.filter((slot) => {
    const [h, m] = slot.split(":").map(Number)
    return h * 60 + m > currentMinutes
  })
}

describe("generateTimeSlots — différentes durées", () => {
  it("durée 15 min : 4 créneaux sur 1h", () => {
    const slots = generateTimeSlots("10:00", "11:00", 15)
    expect(slots).toEqual(["10:00", "10:15", "10:30", "10:45"])
  })

  it("durée 20 min : 3 créneaux sur 1h", () => {
    const slots = generateTimeSlots("09:00", "10:00", 20)
    expect(slots).toEqual(["09:00", "09:20", "09:40"])
  })

  it("durée 45 min : 1 créneau sur 1h", () => {
    const slots = generateTimeSlots("09:00", "10:00", 45)
    expect(slots).toEqual(["09:00"])
  })

  it("durée 60 min : 1 créneau sur 1h exactement", () => {
    const slots = generateTimeSlots("09:00", "10:00", 60)
    expect(slots).toEqual(["09:00"])
  })

  it("durée 90 min : 2 créneaux sur 3h", () => {
    const slots = generateTimeSlots("09:00", "12:00", 90)
    expect(slots).toEqual(["09:00", "10:30"])
  })

  it("plage horaire complète 08:00-18:00 avec durée 30 : 20 créneaux", () => {
    const slots = generateTimeSlots("08:00", "18:00", 30)
    expect(slots).toHaveLength(20)
    expect(slots[0]).toBe("08:00")
    expect(slots[slots.length - 1]).toBe("17:30")
  })

  it("retourne tableau vide si start > end", () => {
    const slots = generateTimeSlots("18:00", "08:00", 30)
    expect(slots).toEqual([])
  })
})

describe("Filtrage des créneaux passés", () => {
  it("retourne tous les créneaux si la date est future", () => {
    const slots = ["09:00", "09:30", "10:00"]
    const futureDate = new Date("2030-12-31")
    const now = new Date("2026-05-03T10:00:00")
    expect(filterPastSlots(slots, futureDate, now)).toEqual(slots)
  })

  it("filtre les créneaux passés pour aujourd'hui", () => {
    const slots = ["08:00", "09:00", "10:00", "11:00", "12:00"]
    const today = new Date("2026-05-03")
    const now = new Date("2026-05-03T10:30:00")
    const result = filterPastSlots(slots, today, now)
    expect(result).toEqual(["11:00", "12:00"])
  })

  it("retourne tous les créneaux si l'heure actuelle est avant tous les créneaux", () => {
    const slots = ["10:00", "10:30", "11:00"]
    const today = new Date("2026-05-03")
    const now = new Date("2026-05-03T08:00:00")
    const result = filterPastSlots(slots, today, now)
    expect(result).toEqual(slots)
  })

  it("retourne tableau vide si tous les créneaux sont passés", () => {
    const slots = ["08:00", "08:30", "09:00"]
    const today = new Date("2026-05-03")
    const now = new Date("2026-05-03T18:00:00")
    const result = filterPastSlots(slots, today, now)
    expect(result).toEqual([])
  })

  it("exclut exactement l'heure courante (créneau déjà commencé)", () => {
    const slots = ["09:00", "09:30", "10:00"]
    const today = new Date("2026-05-03")
    const now = new Date("2026-05-03T09:30:00")
    const result = filterPastSlots(slots, today, now)
    expect(result).toEqual(["10:00"])
  })
})
