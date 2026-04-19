import { useMemo, useState } from 'react'
import { PROJECTS } from '@/data/mockData'
import type { Project } from '@/types/project'
import { ProjectPhase, ProjectStatus, ProjectType } from '@/types/common'

interface ProjectFilters {
  status?: ProjectStatus
  phase?: ProjectPhase
  type?: ProjectType
  priority?: 'high' | 'medium' | 'low'
  search?: string
}

export function useProjects(filters?: ProjectFilters) {
  const [localFilters, setLocalFilters] = useState<ProjectFilters>(filters ?? {})

  const filteredProjects = useMemo(() => {
    let results: Project[] = [...PROJECTS]
    const f = localFilters

    if (f.status) {
      results = results.filter((p) => p.status === f.status)
    }
    if (f.phase) {
      results = results.filter((p) => p.phase === f.phase)
    }
    if (f.type) {
      results = results.filter((p) => p.type === f.type)
    }
    if (f.priority) {
      results = results.filter((p) => p.priority === f.priority)
    }
    if (f.search) {
      const q = f.search.toLowerCase()
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.clientName.toLowerCase().includes(q)
      )
    }

    return results
  }, [localFilters])

  const projectsByPhase = useMemo(() => {
    const byPhase: Record<ProjectPhase, Project[]> = {
      [ProjectPhase.PreDesign]: [],
      [ProjectPhase.SchematicDesign]: [],
      [ProjectPhase.DesignDevelopment]: [],
      [ProjectPhase.ConstructionDocuments]: [],
      [ProjectPhase.Bidding]: [],
      [ProjectPhase.ConstructionAdministration]: [],
    }
    PROJECTS.forEach((p) => {
      byPhase[p.phase].push(p)
    })
    return byPhase
  }, [])

  return {
    projects: filteredProjects,
    allProjects: PROJECTS,
    projectsByPhase,
    filters: localFilters,
    setFilters: setLocalFilters,
    totalCount: PROJECTS.length,
    activeCount: PROJECTS.filter((p) => p.status === ProjectStatus.Active).length,
  }
}
