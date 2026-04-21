import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/design-system/layouts/AppShell'
import { DashboardView } from '@/features/dashboard/DashboardView'
import { ProjectsView } from '@/features/projects/ProjectsView'
import { ClientsView } from '@/features/clients/ClientsView'
import { PipelineView } from '@/features/pipeline/PipelineView'
import { TeamView } from '@/features/team/TeamView'
import { CapacityView } from '@/features/capacity/CapacityView'
import { InvoicesView } from '@/features/invoices/InvoicesView'
import { FinancialsView } from '@/features/financials/FinancialsView'
import { EstimatesView } from '@/features/estimates/EstimatesView'
import { CalendarView } from '@/features/calendar/CalendarView'
import { MarketingView } from '@/features/marketing/MarketingView'
import { SettingsView } from '@/features/settings/SettingsView'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardView />} />
        <Route path="/projects" element={<ProjectsView />} />
        <Route path="/clients" element={<ClientsView />} />
        <Route path="/pipeline" element={<PipelineView />} />
        <Route path="/team" element={<TeamView />} />
        <Route path="/capacity" element={<CapacityView />} />
        <Route path="/invoices" element={<InvoicesView />} />
        <Route path="/financials" element={<FinancialsView />} />
        <Route path="/estimates" element={<EstimatesView />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/marketing" element={<MarketingView />} />
        <Route path="/settings" element={<SettingsView />} />
      </Routes>
    </AppShell>
  )
}
