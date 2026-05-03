import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Barbers
  const barber1 = await prisma.user.upsert({
    where: { email: "karim@zenty.fr" },
    update: {},
    create: {
      email: "karim@zenty.fr",
      name: "Karim Barbershop",
      password: await bcrypt.hash("password123", 10),
      role: "BARBER",
      phone: "06 12 34 56 78",
      bio: "Barbier professionnel avec 10 ans d'expérience. Spécialiste des coupes modernes et dégradés.",
      address: "Paris 10ème",
    },
  })

  const barber2 = await prisma.user.upsert({
    where: { email: "sofia@zenty.fr" },
    update: {},
    create: {
      email: "sofia@zenty.fr",
      name: "Sofia Coiffure",
      password: await bcrypt.hash("password123", 10),
      role: "BARBER",
      phone: "06 98 76 54 32",
      bio: "Coiffeuse passionnée, experte en colorations et soins capillaires.",
      address: "Lyon Centre",
    },
  })

  // Services barber1
  const b1Services = [
    { name: "Coupe homme", description: "Coupe classique + finitions", duration: 30, price: 20 },
    { name: "Dégradé", description: "Dégradé américain ou européen", duration: 45, price: 25 },
    { name: "Barbe", description: "Taille et mise en forme de la barbe", duration: 20, price: 15 },
    { name: "Coupe + Barbe", description: "Forfait coupe et barbe", duration: 60, price: 35 },
  ]

  for (const s of b1Services) {
    const exists = await prisma.service.findFirst({ where: { name: s.name, barberId: barber1.id } })
    if (!exists) await prisma.service.create({ data: { ...s, barberId: barber1.id } })
  }

  // Services barber2
  const b2Services = [
    { name: "Coupe femme", description: "Coupe sur cheveux courts ou mi-longs", duration: 45, price: 35 },
    { name: "Coloration", description: "Coloration complète ou mèches", duration: 90, price: 65 },
    { name: "Soin kératine", description: "Soin lissant longue durée", duration: 120, price: 80 },
  ]

  for (const s of b2Services) {
    const exists = await prisma.service.findFirst({ where: { name: s.name, barberId: barber2.id } })
    if (!exists) await prisma.service.create({ data: { ...s, barberId: barber2.id } })
  }

  // Client
  const client = await prisma.user.upsert({
    where: { email: "client@zenty.fr" },
    update: {},
    create: {
      email: "client@zenty.fr",
      name: "Thomas Dupont",
      password: await bcrypt.hash("password123", 10),
      role: "CLIENT",
      phone: "06 00 11 22 33",
    },
  })

  // Review
  const reviewExists = await prisma.review.findFirst({ where: { userId: client.id, barberId: barber1.id } })
  if (!reviewExists) {
    await prisma.review.create({
      data: {
        userId: client.id,
        barberId: barber1.id,
        rating: 5,
        comment: "Excellent barbier, coupe parfaite ! Je recommande vivement.",
      },
    })
  }

  console.log("✅ Seed terminé !")
  console.log("   Barber 1 : karim@zenty.fr / password123")
  console.log("   Barber 2 : sofia@zenty.fr / password123")
  console.log("   Client   : client@zenty.fr / password123")
}

main().catch(console.error).finally(() => prisma.$disconnect())
