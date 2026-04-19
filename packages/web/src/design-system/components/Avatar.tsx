

const COLORS = [
  '#C8A97E',
  '#3B82F6',
  '#22C55E',
  '#A855F7',
  '#F59E0B',
  '#EF4444',
]

function getColorFromInitials(initials: string): string {
  let hash = 0
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

interface AvatarProps {
  initials: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

const SIZE_MAP = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
}

export function Avatar({ initials, size = 'md', color, className = '' }: AvatarProps) {
  const bg = color ?? getColorFromInitials(initials)
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold font-sans shrink-0 ${SIZE_MAP[size]} ${className}`}
      style={{ backgroundColor: `${bg}25`, color: bg, border: `1px solid ${bg}50` }}
    >
      {initials}
    </div>
  )
}
