import { Star } from "lucide-react"

interface RatingProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  reviewsCount?: number
  className?: string
}

const SIZE_MAP = {
  sm: { star: "w-3.5 h-3.5", text: "text-xs" },
  md: { star: "w-4 h-4", text: "text-sm" },
  lg: { star: "w-5 h-5", text: "text-base" },
}

export function Rating({
  value,
  max = 5,
  size = "md",
  showValue = true,
  reviewsCount,
  className = "",
}: RatingProps) {
  const { star, text } = SIZE_MAP[size]
  const safe = Math.max(0, Math.min(max, value || 0))

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="relative inline-flex">
        {/* empty layer */}
        <div className="flex">
          {Array.from({ length: max }).map((_, i) => (
            <Star key={i} className={`${star} text-gray-200`} />
          ))}
        </div>
        {/* filled layer clipped */}
        <div
          className="absolute inset-0 flex overflow-hidden"
          style={{ width: `${(safe / max) * 100}%` }}
        >
          {Array.from({ length: max }).map((_, i) => (
            <Star key={i} className={`${star} text-amber-400 fill-amber-400 shrink-0`} />
          ))}
        </div>
      </div>
      {showValue && (
        <span className={`${text} font-medium text-gray-700`}>{safe.toFixed(1)}</span>
      )}
      {typeof reviewsCount === "number" && (
        <span className={`${text} text-gray-400`}>({reviewsCount})</span>
      )}
    </div>
  )
}
