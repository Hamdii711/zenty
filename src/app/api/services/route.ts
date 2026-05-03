import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const barberId = searchParams.get("barberId")

  const where: any = { isActive: true }
  if (barberId) where.barberId = barberId

  const services = await prisma.service.findMany({
    where,
    include: { barber: { select: { name: true, image: true } } },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(services)
}

export async function POST(req: Request) {
  try {
    const { name, description, duration, price, barberId } = await req.json()

    if (!name || !duration || !price || !barberId) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
    }

    const service = await prisma.service.create({
      data: { name, description, duration, price, barberId },
    })

    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: "Erreur création service" }, { status: 500 })
  }
}
