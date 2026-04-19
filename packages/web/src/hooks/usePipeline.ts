import { useMemo } from 'react'
import { PIPELINE_OPPORTUNITIES } from '@/data/mockData'
import { PipelineStage } from '@/types/common'
import type { PipelineOpportunity } from '@/types/pipeline'

export function usePipeline() {
  const opportunitiesByStage = useMemo(() => {
    const byStage: Record<PipelineStage, PipelineOpportunity[]> = {
      [PipelineStage.InitialContact]: [],
      [PipelineStage.Consultation]: [],
      [PipelineStage.ProposalSent]: [],
      [PipelineStage.Shortlisted]: [],
      [PipelineStage.Won]: [],
      [PipelineStage.Lost]: [],
    }
    PIPELINE_OPPORTUNITIES.forEach((opp) => {
      byStage[opp.stage].push(opp)
    })
    return byStage
  }, [])

  const weightedPipelineValue = useMemo(() => {
    return PIPELINE_OPPORTUNITIES.reduce((sum, opp) => {
      return sum + opp.estimatedValue * (opp.probability / 100)
    }, 0)
  }, [])

  const totalPipelineValue = useMemo(() => {
    return PIPELINE_OPPORTUNITIES.reduce((sum, opp) => sum + opp.estimatedValue, 0)
  }, [])

  const stageValue = (stage: PipelineStage) =>
    opportunitiesByStage[stage].reduce((sum, opp) => sum + opp.estimatedValue, 0)

  return {
    opportunities: PIPELINE_OPPORTUNITIES,
    opportunitiesByStage,
    weightedPipelineValue,
    totalPipelineValue,
    stageValue,
  }
}
