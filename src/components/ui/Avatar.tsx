interface AvatarProps {
  name?: string | null
  src?: string | null
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  online?: boolean
  className?: string
}

const SIZE_MAP = {
  xs: "w-7 h-7 text-[11px]",
  sm: "w-9 h-9 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
}

// Stable color from name
const PALETTES = [
  "from-violet-500 to-fuchsia-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-purple-500",
  "from-sky-500 to-blue-500",
  "from-lime-500 to-emerald-500",
]

export function colorFromName(name: string | null | undefined) {
  if (!name) return PALETTES[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return PALETTES[hash % PALETTES.length]
}

export function getInitials(name?: string | null) {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({ name, src, size = "md", online, className = "" }: AvatarProps) {
  const sizeClass = SIZE_MAP[size]
  const palette = colorFromName(name)

  return (
    <div className={`relative inline-flex ${className}`}>
      <div
        className={`${sizeClass} rounded-full overflow-hidden flex items-center justify-center font-semibold text-white bg-gradient-to-br ${palette} ring-2 ring-white shadow-sm`}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name || ""} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 dot-online" aria-label="En ligne" />
      )}
    </div>
  )
}
