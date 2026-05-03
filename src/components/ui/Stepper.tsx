import { Check } from "lucide-react"

interface StepperProps {
  steps: string[]
  currentStep: number // 1-based
  className?: string
}

export function Stepper({ steps, currentStep, className = "" }: StepperProps) {
  return (
    <div className={`w-full ${className}`}>
      <ol className="flex items-center justify-between gap-2">
        {steps.map((label, i) => {
          const step = i + 1
          const isDone = step < currentStep
          const isActive = step === currentStep
          return (
            <li key={label} className="flex-1 flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    isDone
                      ? "bg-emerald-500 text-white"
                      : isActive
                      ? "bg-gradient-to-br from-violet-600 to-violet-700 text-white shadow-brand"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : step}
                </div>
                <span
                  className={`text-sm font-medium truncate hidden sm:inline ${
                    isActive ? "text-gray-900" : isDone ? "text-emerald-700" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {step < steps.length && (
                <div className="flex-1 h-0.5 mx-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      step < currentStep ? "bg-emerald-500 w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
