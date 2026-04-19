import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  subText?: string
  icon?: React.ReactNode
  trend?: {
    direction: 'up' | 'down'
    percent: number
  }
  className?: string
}

export function StatCard({ label, value, subText, icon, trend, className = '' }: StatCardProps) {
  return (
    <div
      className={`rounded-card p-5 border border-border bg-surface flex flex-col gap-3 ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</span>
        {icon && (
          <span className="text-text-muted">{icon}</span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-mono font-semibold text-text-primary">{value}</span>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trend.direction === 'up' ? 'text-status-green' : 'text-status-red'
            }`}
          >
            {trend.direction === 'up' ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>{trend.percent}%</span>
          </div>
        )}
      </div>
      {subText && (
        <span className="text-xs text-text-muted">{subText}</span>
      )}
    </div>
  )
}
