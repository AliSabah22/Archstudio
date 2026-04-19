

interface ProgressBarProps {
  value: number
  height?: number
  color?: string
  className?: string
}

export function ProgressBar({ value, height = 6, color = '#C8A97E', className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div
      className={`w-full rounded-full overflow-hidden ${className}`}
      style={{ height: `${height}px`, backgroundColor: '#1E1E20' }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  )
}
