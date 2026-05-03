import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const barberId = searchParams.get("barberId")

  const where: any = {}
  if (barberId) where.barberId = barberId

  const reviews = await prisma.review.findMany({
    where,
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(reviews)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  try {
    const { barberId, rating, comment } = await req.json()
    const userId = session.user.id

    if (!barberId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: { userId, barberId, rating, comment },
      include: { user: { select: { name: true } } },
    })

    return NextResponse.json(review)
  } catch {
    return NextResponse.json({ error: "Erreur création avis" }, { status: 500 })
  }
}
