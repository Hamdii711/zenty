import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const userId = session.user.id
  const userRole = session.user.role

  const { searchParams } = new URL(req.url)
  const barberId = searchParams.get("barberId")
  const date = searchParams.get("date")

  const where: any = {}

  // Barbers see only their own appointments; clients see theirs
  if (userRole === "BARBER") {
    where.barberId = userId
  } else {
    where.userId = userId
  }

  if (barberId && userRole === "ADMIN") where.barberId = barberId
  if (date) where.date = new Date(date)

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      user: { select: { name: true, email: true, phone: true } },
      service: true,
      barber: { select: { name: true, image: true } },
    },
    orderBy: { date: "asc" },
  })

  return NextResponse.json(appointments)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  try {
    const { barberId, serviceId, date, startTime, endTime } = await req.json()
    const userId = session.user.id

    if (!barberId || !serviceId || !date || !startTime) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
    }

    // Check availability
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        barberId,
        date: new Date(date),
        startTime,
        status: { not: "CANCELLED" },
      },
    })

    if (existingAppointment) {
      return NextResponse.json({ error: "Ce créneau n'est plus disponible" }, { status: 409 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        barberId,
        serviceId,
        date: new Date(date),
        startTime,
        endTime: endTime || startTime,
        status: "PENDING",
      },
      include: { service: true, barber: { select: { name: true } } },
    })

    return NextResponse.json(appointment)
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la réservation" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  try {
    const { id, status } = await req.json()

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(appointment)
  } catch (error) {
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 })
  }
}
