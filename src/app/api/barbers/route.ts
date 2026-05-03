import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
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
}
