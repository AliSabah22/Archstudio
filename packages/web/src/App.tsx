import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/design-system/layouts/AppShell'
import { DashboardView } from '@/features/dashboard/DashboardView'
import { ProjectsView } from '@/features/projects/ProjectsView'
import { ClientsView } from '@/features/clients/ClientsView'
import { PipelineView } from '@/features/pipeline/PipelineView'
import { TeamView } from '@/features/team/TeamView'
import { InvoicesView } from '@/features/invoices/InvoicesView'
import { EstimatesView } from '@/features/estimates/EstimatesView'
import { CalendarView } from '@/features/calendar/CalendarView'
import { MarketingView } from '@/features/marketing/MarketingView'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardView />} />
        <Route path="/projects" element={<ProjectsView />} />
        <Route path="/clients" element={<ClientsView />} />
        <Route path="/pipeline" element={<PipelineView />} />
        <Route path="/team" element={<TeamView />} />
        <Route path="/invoices" element={<InvoicesView />} />
        <Route path="/estimates" element={<EstimatesView />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/marketing" element={<MarketingView />} />
      </Routes>
    </AppShell>
  )
}
