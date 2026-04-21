import { useState } from 'react'
import { PageHeader } from '@/design-system/layouts/PageHeader'

type SettingsTab = 'custom_fields' | 'phase_definitions' | 'phase_checklists' | 'fee_defaults' | 'team_roles'

const CUSTOM_FIELDS = [
  { name: 'Permit Application Number', type: 'text', required: false, visibility: 'All types' },
  { name: 'Zoning Classification', type: 'dropdown', options: ['R1', 'R2', 'C1', 'C2', 'M1', 'M2', 'Mixed'], required: false, visibility: 'All types' },
  { name: 'AHJ Contact', type: 'text', required: false, visibility: 'All types' },
  { name: 'LEED Target', type: 'dropdown', options: ['None', 'Certified', 'Silver', 'Gold', 'Platinum'], required: false, visibility: 'Commercial, Institutional' },
  { name: 'Heritage Status', type: 'checkbox', required: false, visibility: 'Residential, Commercial' },
  { name: 'Heritage Registry Number', type: 'text', required: false, visibility: 'Residential, Commercial' },
]

const PHASE_DEFINITIONS = [
  { phase: 'Pre-Design', abbreviation: 'PD', defaultFeePct: 5, residentialHrs: 40, commercialHrs: 120 },
  { phase: 'Schematic Design', abbreviation: 'SD', defaultFeePct: 15, residentialHrs: 140, commercialHrs: 500 },
  { phase: 'Design Development', abbreviation: 'DD', defaultFeePct: 20, residentialHrs: 200, commercialHrs: 800 },
  { phase: 'Construction Documents', abbreviation: 'CD', defaultFeePct: 40, residentialHrs: 260, commercialHrs: 1200 },
  { phase: 'Bidding / Tendering', abbreviation: 'Bid', defaultFeePct: 5, residentialHrs: 20, commercialHrs: 80 },
  { phase: 'Construction Administration', abbreviation: 'CA', defaultFeePct: 15, residentialHrs: 40, commercialHrs: 180 },
]

const PHASE_CHECKLISTS: Record<string, { id: number; item: string; checked: boolean }[]> = {
  'Schematic Design': [
    { id: 1, item: 'Site plan approved by client', checked: true },
    { id: 2, item: 'Floor plans at 1/8" scale', checked: true },
    { id: 3, item: 'Preliminary structural consultation complete', checked: true },
    { id: 4, item: 'Preliminary cost estimate received', checked: false },
    { id: 5, item: 'Schematic design presentation delivered', checked: true },
    { id: 6, item: 'Client sign-off obtained', checked: false },
  ],
  'Design Development': [
    { id: 1, item: 'Material schedule drafted', checked: false },
    { id: 2, item: 'Structural system confirmed with engineer', checked: false },
    { id: 3, item: 'MEP system coordination complete', checked: false },
    { id: 4, item: 'DD drawings 100% complete', checked: false },
    { id: 5, item: 'Client sign-off on DD package', checked: false },
  ],
  'Construction Documents': [
    { id: 1, item: 'All trades coordinated', checked: false },
    { id: 2, item: 'Specifications complete', checked: false },
    { id: 3, item: 'Drawing set stamped by engineer', checked: false },
    { id: 4, item: 'Building permit application submitted', checked: false },
    { id: 5, item: 'Permit issued', checked: false },
  ],
}

const FEE_DEFAULTS = [
  { role: 'Principal', hourlyRate: 250, targetUtilization: 75 },
  { role: 'Senior Architect', hourlyRate: 175, targetUtilization: 80 },
  { role: 'Architect', hourlyRate: 130, targetUtilization: 82 },
  { role: 'Designer', hourlyRate: 95, targetUtilization: 85 },
  { role: 'Intern', hourlyRate: 55, targetUtilization: 80 },
]

function CustomFieldsTab() {
  const [fields, setFields] = useState(CUSTOM_FIELDS)
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-sm text-text-primary mb-1">Custom Project Fields</h3>
          <p className="text-xs text-text-muted">Define additional fields that appear on every project record. These fields become searchable and filterable.</p>
        </div>
        <button className="px-3 py-1.5 rounded-button text-xs font-medium" style={{ background: 'rgba(200,169,126,0.15)', border: '1px solid rgba(200,169,126,0.3)', color: '#C8A97E' }}>
          + Add Custom Field
        </button>
      </div>
      <div className="rounded-card border border-border overflow-hidden">
        <div className="grid px-4 py-2 border-b border-border" style={{ gridTemplateColumns: '2fr 1fr 2fr 80px 80px' }}>
          {['Field Name', 'Type', 'Visibility', 'Required', 'Actions'].map((h) => (
            <div key={h} className="text-xs font-medium text-text-muted uppercase tracking-wider">{h}</div>
          ))}
        </div>
        {fields.map((f, i) => (
          <div key={i} className="grid px-4 py-3 border-b border-border last:border-b-0 items-center hover:bg-bg/50 transition-colors" style={{ gridTemplateColumns: '2fr 1fr 2fr 80px 80px' }}>
            <span className="text-sm text-text-primary">{f.name}</span>
            <div>
              <span className="text-xs px-1.5 py-0.5 rounded capitalize" style={{ background: '#1E1E20', color: '#8A8A8E' }}>{f.type}</span>
              {f.type === 'dropdown' && f.options && (
                <div className="text-xs text-text-muted mt-0.5">{f.options.slice(0, 3).join(', ')}{f.options.length > 3 ? '...' : ''}</div>
              )}
            </div>
            <span className="text-xs text-text-muted">{f.visibility}</span>
            <span className="text-xs" style={{ color: f.required ? '#22C55E' : '#5A5A60' }}>{f.required ? 'Yes' : 'Optional'}</span>
            <div className="flex items-center gap-2">
              <button className="text-xs text-text-muted hover:text-gold transition-colors">Edit</button>
              <button onClick={() => setFields((prev) => prev.filter((_, j) => j !== i))} className="text-xs text-text-muted hover:text-red-400 transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PhaseDefinitionsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-sm text-text-primary mb-1">Phase Definitions</h3>
          <p className="text-xs text-text-muted">AIA standard phases with firm-specific fee percentages and hour allocations by project type.</p>
        </div>
        <button className="px-3 py-1.5 rounded-button text-xs font-medium" style={{ background: 'rgba(200,169,126,0.12)', border: '1px solid rgba(200,169,126,0.2)', color: '#C8A97E' }}>
          Edit Phase Structure
        </button>
      </div>
      <div className="rounded-card border border-border overflow-hidden">
        <div className="grid px-4 py-2 border-b border-border" style={{ gridTemplateColumns: '2fr 60px 80px 120px 120px' }}>
          {['Phase', 'Code', 'Fee %', 'Residential Hrs', 'Commercial Hrs'].map((h) => (
            <div key={h} className="text-xs font-medium text-text-muted uppercase tracking-wider">{h}</div>
          ))}
        </div>
        {PHASE_DEFINITIONS.map((p, i) => (
          <div key={i} className="grid px-4 py-3 border-b border-border last:border-b-0 items-center" style={{ gridTemplateColumns: '2fr 60px 80px 120px 120px' }}>
            <span className="text-sm text-text-primary">{p.phase}</span>
            <span className="text-xs font-mono text-text-muted">{p.abbreviation}</span>
            <span className="text-sm font-mono font-semibold text-gold">{p.defaultFeePct}%</span>
            <span className="text-sm font-mono text-text-secondary">{p.residentialHrs}h</span>
            <span className="text-sm font-mono text-text-secondary">{p.commercialHrs}h</span>
          </div>
        ))}
        <div className="px-4 py-2 border-t border-border" style={{ background: 'rgba(200,169,126,0.03)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Total</span>
            <div className="flex gap-4">
              <span className="text-xs font-mono font-semibold text-gold">{PHASE_DEFINITIONS.reduce((s, p) => s + p.defaultFeePct, 0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PhaseChecklistsTab() {
  const [checklists, setChecklists] = useState(PHASE_CHECKLISTS)
  const [activePhase, setActivePhase] = useState('Schematic Design')

  const toggle = (id: number) => {
    setChecklists((prev) => ({
      ...prev,
      [activePhase]: prev[activePhase].map((item) => item.id === id ? { ...item, checked: !item.checked } : item),
    }))
  }

  const currentList = checklists[activePhase] ?? []
  const completedCount = currentList.filter((i) => i.checked).length

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-serif text-sm text-text-primary mb-1">Phase Checklists</h3>
        <p className="text-xs text-text-muted">Define completion criteria for each phase. These checklists appear on every project.</p>
      </div>
      <div className="flex items-center gap-1 mb-4 border-b border-border">
        {Object.keys(checklists).map((phase) => (
          <button
            key={phase}
            onClick={() => setActivePhase(phase)}
            className="px-3 py-2 text-xs font-medium border-b-2 transition-all -mb-px"
            style={{ borderColor: activePhase === phase ? '#C8A97E' : 'transparent', color: activePhase === phase ? '#C8A97E' : '#8A8A8E' }}
          >
            {phase}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-text-muted">{completedCount} / {currentList.length} items complete</span>
        <button className="text-xs px-2.5 py-1 rounded-button" style={{ background: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.2)', color: '#C8A97E' }}>+ Add Item</button>
      </div>
      <div className="flex flex-col gap-2">
        {currentList.map((item) => (
          <label key={item.id} className="flex items-center gap-3 p-3 rounded-button cursor-pointer hover:bg-bg/50 transition-colors" style={{ background: '#0A0A0B', border: '1px solid #1E1E20' }}>
            <div
              className="w-4 h-4 rounded shrink-0 flex items-center justify-center border"
              style={{ background: item.checked ? '#22C55E' : 'transparent', borderColor: item.checked ? '#22C55E' : '#3A3A3E' }}
              onClick={() => toggle(item.id)}
            >
              {item.checked && <span style={{ color: '#fff', fontSize: 10 }}>✓</span>}
            </div>
            <span className="text-sm text-text-secondary" style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? '#5A5A60' : undefined }}>{item.item}</span>
          </label>
        ))}
      </div>
      {completedCount === currentList.length && currentList.length > 0 && (
        <div className="mt-3 p-3 rounded-button" style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <span className="text-xs" style={{ color: '#22C55E' }}>✓ All {activePhase} checklist items complete — phase can be marked done</span>
        </div>
      )}
    </div>
  )
}

function FeeDefaultsTab() {
  return (
    <div>
      <div className="mb-4">
        <h3 className="font-serif text-sm text-text-primary mb-1">Fee Defaults & Rate Card</h3>
        <p className="text-xs text-text-muted">Default billing rates and utilization targets by staff role. Used in estimate calculations and capacity planning.</p>
      </div>
      <div className="rounded-card border border-border overflow-hidden">
        <div className="grid px-4 py-2 border-b border-border" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
          {['Role', 'Hourly Rate', 'Target Utilization'].map((h) => (
            <div key={h} className="text-xs font-medium text-text-muted uppercase tracking-wider">{h}</div>
          ))}
        </div>
        {FEE_DEFAULTS.map((f, i) => (
          <div key={i} className="grid px-4 py-3 border-b border-border last:border-b-0 items-center" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
            <span className="text-sm text-text-primary">{f.role}</span>
            <span className="text-sm font-mono font-semibold text-gold">${f.hourlyRate}/hr</span>
            <span className="text-sm font-mono text-text-secondary">{f.targetUtilization}%</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-end">
        <button className="px-4 py-2 rounded-button text-sm font-medium" style={{ background: 'rgba(200,169,126,0.15)', border: '1px solid rgba(200,169,126,0.3)', color: '#C8A97E' }}>
          Save Changes
        </button>
      </div>
    </div>
  )
}

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('custom_fields')

  const TABS: { id: SettingsTab; label: string }[] = [
    { id: 'custom_fields', label: 'Custom Fields' },
    { id: 'phase_definitions', label: 'Phase Definitions' },
    { id: 'phase_checklists', label: 'Phase Checklists' },
    { id: 'fee_defaults', label: 'Fee Defaults' },
    { id: 'team_roles', label: 'Team Roles' },
  ]

  return (
    <div className="p-8">
      <PageHeader title="Settings" subtitle="Customize the portal to match your firm's workflows" />

      <div className="flex gap-0 border-b border-border mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px"
            style={{ borderColor: activeTab === tab.id ? '#C8A97E' : 'transparent', color: activeTab === tab.id ? '#C8A97E' : '#8A8A8E' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'custom_fields' && <CustomFieldsTab />}
      {activeTab === 'phase_definitions' && <PhaseDefinitionsTab />}
      {activeTab === 'phase_checklists' && <PhaseChecklistsTab />}
      {activeTab === 'fee_defaults' && <FeeDefaultsTab />}
      {activeTab === 'team_roles' && (
        <div className="text-center py-12">
          <div className="text-2xl mb-2">⚙</div>
          <p className="text-sm text-text-muted">Team role permissions coming soon.</p>
          <p className="text-xs text-text-muted mt-1">Define what each role can view, edit, and approve in the portal.</p>
        </div>
      )}
    </div>
  )
}
