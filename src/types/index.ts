export type { User, Service, Appointment, Review } from "@prisma/client"

export type Role = "CLIENT" | "BARBER" | "ADMIN"

export interface BookingStep {
  service: string | null
  barber: string | null
  date: string | null
  time: string | null
}
