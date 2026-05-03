import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const barber = await prisma.user.findUnique({
    where: { id, role: "BARBER" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      address: true,
      phone: true,
      services: {
        where: { isActive: true },
        orderBy: { name: "asc" },
      },
    },
  })

  if (!barber) return NextResponse.json({ error: "Introuvable" }, { status: 404 })
  return NextResponse.json(barber)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, bio, address, phone, image } = await req.json()
    const updated = await prisma.user.update({
      where: { id },
      data: { name, bio, address, phone, image },
    })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 })
  }
}
