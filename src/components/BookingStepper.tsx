import { Store, Scissors, CalendarDays, CheckCircle2, Check } from "lucide-react"

const STEP_META = [
  { label: "Professionnel", icon: Store },
  { label: "Service", icon: Scissors },
  { label: "Date & Heure", icon: CalendarDays },
  { label: "Confirmation", icon: CheckCircle2 },
]

export function BookingStepper({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between mb-8 px-1">
      {STEP_META.map((s, idx) => {
        const n = idx + 1
        const Icon = s.icon
        const done = step > n
        const active = step === n
        return (
          <div key={n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  done
                    ? "bg-purple-600 text-white"
                    : active
                    ? "bg-purple-600 text-white ring-4 ring-purple-100"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  active ? "text-purple-700" : done ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < STEP_META.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-5 sm:mb-0 transition-all ${
                  step > n ? "bg-purple-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
