import Link from "next/link"
import {
  Calendar,
  Star,
  Shield,
  ArrowRight,
  Sparkles,
  Search,
  CalendarCheck,
  Scissors,
  Users,
  TrendingUp,
} from "lucide-react"
import { Avatar } from "@/components/ui/Avatar"
import { Rating } from "@/components/ui/Rating"

const STATS = [
  { value: "500+", label: "Pros inscrits", icon: Scissors },
  { value: "10k+", label: "Clients heureux", icon: Users },
  { value: "4.9", label: "Note moyenne", icon: Star },
]

const FEATURES = [
  {
    icon: Calendar,
    color: "from-violet-500 to-fuchsia-500",
    title: "Réservation instantanée",
    desc: "Trouvez un créneau et confirmez en moins d'une minute, 24h/24.",
  },
  {
    icon: Star,
    color: "from-amber-500 to-orange-500",
    title: "Pros vérifiés",
    desc: "Avis authentiques, photos réelles, professionnels validés.",
  },
  {
    icon: Shield,
    color: "from-emerald-500 to-teal-500",
    title: "Paiement sécurisé",
    desc: "Réglez en ligne en toute sérénité. Annulation flexible.",
  },
]

const STEPS = [
  { icon: Search, title: "Cherchez", desc: "Explorez les pros près de chez vous." },
  { icon: CalendarCheck, title: "Réservez", desc: "Choisissez votre créneau idéal." },
  { icon: Sparkles, title: "Profitez", desc: "Détendez-vous, on s'occupe du reste." },
]

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    role: "Cliente régulière",
    rating: 5,
    text: "L'app la plus fluide que j'ai utilisée. Je réserve mon coiffeur en 30 secondes.",
  },
  {
    name: "Karim B.",
    role: "Barbier indépendant",
    rating: 5,
    text: "Mon agenda est rempli et je passe 10x moins de temps au téléphone. Game changer.",
  },
  {
    name: "Léa D.",
    role: "Cliente",
    rating: 4.5,
    text: "Interface ultra propre, et les rappels SMS sont parfaits.",
  },
]

export default function Home() {
  return (
    <div>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden gradient-hero animate-gradient">
        {/* Decorative SVG shapes */}
        <svg
          aria-hidden
          className="absolute -top-24 -right-24 w-[480px] h-[480px] opacity-30 animate-float"
          viewBox="0 0 400 400"
        >
          <defs>
            <radialGradient id="g1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="200" fill="url(#g1)" />
        </svg>
        <svg
          aria-hidden
          className="absolute -bottom-32 -left-24 w-[420px] h-[420px] opacity-25 animate-float"
          style={{ animationDelay: "2s" }}
          viewBox="0 0 400 400"
        >
          <defs>
            <radialGradient id="g2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="200" fill="url(#g2)" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/80 border border-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 shadow-soft">
              <Sparkles className="w-4 h-4 animate-sparkle" />
              Nouveau · Réservez en ligne en 1 clic
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
              Vos rendez-vous beauté,{" "}
              <span className="gradient-text">en un clic</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Coiffeur, barbier, soin du visage… trouvez le pro qu'il vous faut,
              comparez les avis et réservez instantanément.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/explore" className="btn btn-primary btn-lg">
                Réserver maintenant
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/auth/register" className="btn btn-secondary btn-lg">
                Devenir professionnel
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto stagger">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="bg-white/70 backdrop-blur rounded-2xl p-4 border border-white shadow-soft"
                >
                  <s.icon className="w-5 h-5 text-violet-500 mx-auto mb-1.5" />
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {s.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================== FEATURES =========================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge badge-brand mb-3">Pourquoi Zenty</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              La réservation simplifiée
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Une expérience pensée pour vous faire gagner du temps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 stagger">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="card card-hover p-7 group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform`}
                >
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== COMMENT ÇA MARCHE ====================== */}
      <section className="py-20 bg-gradient-to-b from-white to-violet-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge badge-brand mb-3">Comment ça marche</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              3 étapes, c'est tout
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="card p-7 text-center h-full">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600 to-violet-700 shadow-brand" />
                    <div className="relative w-full h-full flex items-center justify-center text-white">
                      <s.icon className="w-7 h-7" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-violet-600 flex items-center justify-center text-xs font-bold text-violet-600">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {s.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= TESTIMONIALS ========================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge badge-brand mb-3">Témoignages</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Ils nous font confiance
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 stagger">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card card-hover p-7">
                <Rating value={t.rating} size="sm" showValue={false} />
                <p className="text-gray-700 mt-3 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100">
                  <Avatar name={t.name} size="sm" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-cta animate-gradient" />
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full opacity-15"
          preserveAspectRatio="none"
          viewBox="0 0 1200 400"
        >
          <circle cx="100" cy="80" r="80" fill="white" />
          <circle cx="1100" cy="350" r="120" fill="white" />
          <circle cx="600" cy="200" r="40" fill="white" />
        </svg>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <TrendingUp className="w-10 h-10 text-white/90 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Prêt à transformer votre façon de réserver&nbsp;?
          </h2>
          <p className="text-violet-100 text-lg mb-8 max-w-xl mx-auto">
            Rejoignez Zenty et profitez d'une expérience pensée pour la simplicité.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 bg-white text-violet-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-violet-50 transition shadow-xl"
            >
              Trouver un pro
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white border border-white/30 px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition"
            >
              Devenir pro
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
