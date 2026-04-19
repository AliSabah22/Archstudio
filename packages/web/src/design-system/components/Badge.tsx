import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  color?: string
  bg?: string
  className?: string
}

export function Badge({ children, color, bg, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-badge font-sans ${className}`}
      style={
        color || bg
          ? {
              color: color,
              backgroundColor: bg,
            }
          : undefined
      }
    >
      {children}
    </span>
  )
}
