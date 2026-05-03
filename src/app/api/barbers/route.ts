import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const barbers = await prisma.user.findMany({
      where: { role: "BARBER" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        services: { where: { isActive: true } },
      },
    })
    return NextResponse.json(barbers)
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error("[/api/barbers] FULL ERROR:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
