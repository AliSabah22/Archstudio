import { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react'
import { PageHeader } from '@/design-system/layouts/PageHeader'
import { CALENDAR_EVENTS } from '@/data/mockData'
import { EventType } from '@/types/common'
import type { CalendarEvent } from '@/data/mockData'

const EVENT_TYPE_CONFIG: Record<EventType, { color: string; bg: string; border: string; label: string }> = {
  [EventType.Meeting]: { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.35)', label: 'Meeting' },
  [EventType.SiteVisit]: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.35)', label: 'Site Visit' },
  [EventType.Deadline]: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)', label: 'Deadline' },
  [EventType.Standup]: { color: '#A855F7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.35)', label: 'Standup' },
  [EventType.Consultation]: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', label: 'Consultation' },
}

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const WEEK_DATES = ['2024-04-08', '2024-04-09', '2024-04-10', '2024-04-11', '2024-04-12']

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

function EventCard({ event }: { event: CalendarEvent }) {
  const config = EVENT_TYPE_CONFIG[event.type]
  return (
    <div
      className="rounded-button p-2.5 mb-2 border-l-2"
      style={{ backgroundColor: config.bg, borderLeftColor: config.color, borderColor: config.border, borderWidth: '1px', borderLeftWidth: '3px' }}
    >
      <div className="flex items-start justify-between gap-1 mb-1">
        <span className="text-xs font-semibold leading-tight" style={{ color: config.color }}>
          {event.title}
        </span>
        <span className="text-xs font-mono text-text-muted shrink-0 ml-1">
          {event.startTime}
        </span>
      </div>
      {event.projectName && (
        <div className="text-xs text-text-muted truncate mb-1">{event.projectName}</div>
      )}
      {event.location && (
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <MapPin className="w-2.5 h-2.5 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      )}
      <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
        <Users className="w-2.5 h-2.5 shrink-0" />
        <span>{event.attendees.join(', ')}</span>
      </div>
    </div>
  )
}

export function CalendarView() {
  const [weekOffset, setWeekOffset] = useState(0)

  const weekDates = WEEK_DATES.map((d) => {
    const date = new Date(d)
    date.setDate(date.getDate() + weekOffset * 7)
    return date.toISOString().split('T')[0]
  })

  const eventsForDate = (dateStr: string): CalendarEvent[] => {
    return CALENDAR_EVENTS.filter((e) => e.date === dateStr)
  }

  const totalEvents = CALENDAR_EVENTS.length

  return (
    <div className="p-8">
      <PageHeader
        title="Calendar"
        subtitle="Weekly schedule"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset((o) => o - 1)}
              className="p-2 rounded-button border border-border text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1.5 rounded-button border border-border bg-surface text-sm text-text-secondary font-mono">
              {weekOffset === 0 ? 'This Week' : weekOffset === 1 ? 'Next Week' : weekOffset === -1 ? 'Last Week' : `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
            </div>
            <button
              onClick={() => setWeekOffset((o) => o + 1)}
              className="p-2 rounded-button border border-border text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {weekOffset !== 0 && (
              <button
                onClick={() => setWeekOffset(0)}
                className="px-3 py-1.5 rounded-button border border-border text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Today
              </button>
            )}
          </div>
        }
      />

      {/* Legend */}
      <div className="flex items-center gap-4 mb-5">
        {Object.entries(EVENT_TYPE_CONFIG).map(([type, config]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
            <span className="text-xs text-text-muted">{config.label}</span>
          </div>
        ))}
        <span className="ml-auto text-xs text-text-muted">{totalEvents} events this week</span>
      </div>

      {/* 5-Day Grid */}
      <div className="grid grid-cols-5 gap-3">
        {WEEK_DAYS.map((day, i) => {
          const dateStr = weekDates[i]
          const dayEvents = eventsForDate(dateStr)
          const isToday = dateStr === '2024-04-08'

          return (
            <div
              key={day}
              className={`rounded-card border bg-surface min-h-[400px] flex flex-col ${
                isToday ? 'border-gold/40' : 'border-border'
              }`}
            >
              {/* Day header */}
              <div
                className={`flex flex-col px-3 py-3 border-b ${
                  isToday ? 'border-gold/30' : 'border-border'
                }`}
              >
                <span className="text-xs font-medium text-text-muted">{day}</span>
                <span
                  className={`text-sm font-mono font-semibold ${
                    isToday ? 'text-gold' : 'text-text-secondary'
                  }`}
                >
                  {formatDayLabel(dateStr)}
                </span>
              </div>

              {/* Events */}
              <div className="p-2 flex-1">
                {dayEvents.length === 0 ? (
                  <div className="flex items-center justify-center h-16 text-xs text-text-muted">
                    No events
                  </div>
                ) : (
                  dayEvents.map((evt) => <EventCard key={evt.id} event={evt} />)
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
