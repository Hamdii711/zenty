import { describe, it, expect } from "vitest"
import { formatPrice, formatDate, generateTimeSlots, getDayName } from "@/lib/utils"

describe("formatPrice", () => {
  it("formate 25 en '25,00 €'", () => {
    expect(formatPrice(25)).toBe("25,00\u00a0€")
  })

  it("formate 0 en '0,00 €'", () => {
    expect(formatPrice(0)).toBe("0,00\u00a0€")
  })

  it("formate un prix décimal", () => {
    expect(formatPrice(12.5)).toBe("12,50\u00a0€")
  })
})

describe("formatDate", () => {
  it("contient le jour '15'", () => {
    const result = formatDate(new Date("2026-01-15"))
    expect(result).toContain("15")
  })

  it("contient l'année '2026'", () => {
    const result = formatDate(new Date("2026-01-15"))
    expect(result).toContain("2026")
  })

  it("retourne une chaîne non vide", () => {
    expect(formatDate(new Date("2026-01-15"))).toBeTruthy()
  })
})

describe("generateTimeSlots", () => {
  it("génère ['09:00', '09:30'] pour 09:00-10:00 avec durée 30", () => {
    expect(generateTimeSlots("09:00", "10:00", 30)).toEqual(["09:00", "09:30"])
  })

  it("retourne [] quand start === end", () => {
    expect(generateTimeSlots("09:00", "09:00", 30)).toEqual([])
  })

  it("génère un seul créneau quand la durée correspond exactement", () => {
    expect(generateTimeSlots("09:00", "09:30", 30)).toEqual(["09:00"])
  })

  it("génère des créneaux de 60 minutes", () => {
    expect(generateTimeSlots("08:00", "10:00", 60)).toEqual(["08:00", "09:00"])
  })

  it("retourne [] quand la durée dépasse l'intervalle", () => {
    expect(generateTimeSlots("09:00", "09:20", 30)).toEqual([])
  })
})

describe("getDayName", () => {
  it("retourne 'Lundi' pour l'index 0", () => {
    expect(getDayName(0)).toBe("Lundi")
  })

  it("retourne 'Dimanche' pour l'index 6", () => {
    expect(getDayName(6)).toBe("Dimanche")
  })

  it("retourne 'Mercredi' pour l'index 2", () => {
    expect(getDayName(2)).toBe("Mercredi")
  })
})
