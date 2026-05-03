import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, description, duration, price } = await req.json()
    const updated = await prisma.service.update({
      where: { id },
      data: { name, description, duration, price },
    })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.service.update({
      where: { id },
      data: { isActive: false },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 })
  }
}
