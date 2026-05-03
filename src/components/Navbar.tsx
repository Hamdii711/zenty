"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  Scissors,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Calendar,
  Compass,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Avatar } from "./ui/Avatar"

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const user = session?.user as { name?: string | null; image?: string | null; role?: string } | undefined

  useEffect(() => {
    setDrawerOpen(false)
    setProfileOpen(false)
  }, [pathname])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const dashboardHref = user?.role === "BARBER" ? "/dashboard/barber" : "/dashboard"
  const navLinks = [
    { href: "/explore", label: "Explorer", icon: Compass },
    { href: "/booking", label: "Réserver", icon: Calendar },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center shadow-brand group-hover:scale-105 transition-transform">
                <Scissors className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-sparkle" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="gradient-text">Zenty</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => {
                const active = pathname?.startsWith(l.href)
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      active
                        ? "text-violet-700 bg-violet-50"
                        : "text-gray-600 hover:text-violet-600 hover:bg-gray-50"
                    }`}
                  >
                    {l.label}
                  </Link>
                )
              })}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((s) => !s)}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 hover:border-violet-200 hover:shadow-sm transition"
                  >
                    <Avatar name={user?.name} src={user?.image} size="sm" />
                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                      {user?.name?.split(" ")[0] || "Profil"}
                    </span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 card p-1.5 animate-fade-in">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-400">{user?.role || "CLIENT"}</p>
                      </div>
                      <Link
                        href={dashboardHref}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      {user?.role === "BARBER" && (
                        <Link
                          href="/dashboard/barber/services"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition"
                        >
                          <Scissors className="w-4 h-4" />
                          Mes services
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth/login" className="btn btn-ghost btn-md">
                    Connexion
                  </Link>
                  <Link href="/auth/register" className="btn btn-primary btn-md">
                    Inscription
                  </Link>
                </>
              )}
            </div>

            {/* Mobile burger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setDrawerOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-[60] transition ${
          drawerOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setDrawerOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span className="font-semibold gradient-text text-lg">Zenty</span>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {session && (
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <Avatar name={user?.name} src={user?.image} size="md" />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.role || "CLIENT"}</p>
              </div>
            </div>
          )}

          <div className="p-3 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition"
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <div className="mt-3 flex flex-col gap-2 px-1">
                <Link href="/auth/login" className="btn btn-secondary btn-md">
                  Connexion
                </Link>
                <Link href="/auth/register" className="btn btn-primary btn-md">
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}
