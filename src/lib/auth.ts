import type { Role } from "@/types"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) redirect("/auth/login")
  return session
}

export async function requireRole(roles: Role[]) {
  const session = await requireAuth()
  const userRole = session.user?.role as Role | undefined
  if (!userRole || !roles.includes(userRole)) redirect("/")
  return session
}
