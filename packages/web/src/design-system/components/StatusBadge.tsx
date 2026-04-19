
import { Badge } from './Badge'

type StatusKey =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'active'
  | 'completed'
  | 'on_hold'
  | 'won'
  | 'lost'
  | 'initial_contact'
  | 'consultation'
  | 'proposal_sent'
  | 'shortlisted'
  | 'schematic_design'
  | 'design_development'
  | 'construction_documents'
  | 'bidding'
  | 'construction_administration'
  | 'pre_design'
  | 'residential'
  | 'commercial'
  | 'institutional'
  | 'interior'
  | 'mixed_use'

const STATUS_CONFIG: Record<StatusKey, { color: string; bg: string; label: string }> = {
  draft: { color: '#8A8A8E', bg: '#1E1E20', label: 'Draft' },
  sent: { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', label: 'Sent' },
  paid: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)', label: 'Paid' },
  overdue: { color: '#EF4444', bg: 'rgba(239,68,68,0.15)', label: 'Overdue' },
  active: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)', label: 'Active' },
  completed: { color: '#C8A97E', bg: 'rgba(200,169,126,0.15)', label: 'Completed' },
  on_hold: { color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', label: 'On Hold' },
  won: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)', label: 'Won' },
  lost: { color: '#EF4444', bg: 'rgba(239,68,68,0.15)', label: 'Lost' },
  initial_contact: { color: '#8A8A8E', bg: '#1E1E20', label: 'Initial Contact' },
  consultation: { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', label: 'Consultation' },
  proposal_sent: { color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', label: 'Proposal Sent' },
  shortlisted: { color: '#A855F7', bg: 'rgba(168,85,247,0.15)', label: 'Shortlisted' },
  pre_design: { color: '#8A8A8E', bg: '#1E1E20', label: 'Pre-Design' },
  schematic_design: { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', label: 'Schematic Design' },
  design_development: { color: '#A855F7', bg: 'rgba(168,85,247,0.15)', label: 'Design Development' },
  construction_documents: { color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', label: 'Construction Docs' },
  bidding: { color: '#C8A97E', bg: 'rgba(200,169,126,0.15)', label: 'Bidding' },
  construction_administration: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)', label: 'CA Phase' },
  residential: { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', label: 'Residential' },
  commercial: { color: '#C8A97E', bg: 'rgba(200,169,126,0.15)', label: 'Commercial' },
  institutional: { color: '#A855F7', bg: 'rgba(168,85,247,0.15)', label: 'Institutional' },
  interior: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)', label: 'Interior' },
  mixed_use: { color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', label: 'Mixed Use' },
}

interface StatusBadgeProps {
  status: StatusKey
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { color: '#8A8A8E', bg: '#1E1E20', label: status }
  return (
    <Badge color={config.color} bg={config.bg} className={className}>
      {config.label}
    </Badge>
  )
}
