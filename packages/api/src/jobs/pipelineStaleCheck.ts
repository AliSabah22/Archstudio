import { Worker, Queue } from 'bullmq'
import { getRedis } from '../lib/redis.js'
import { prisma } from '../lib/db.js'

export const PIPELINE_STALE_CHECK_QUEUE = 'pipeline-stale-check'
const STALE_THRESHOLD_DAYS = 14

export function createPipelineStaleCheckQueue() {
  const connection = getRedis()
  return new Queue(PIPELINE_STALE_CHECK_QUEUE, { connection })
}

export function startPipelineStaleCheckWorker() {
  const connection = getRedis()

  const worker = new Worker(
    PIPELINE_STALE_CHECK_QUEUE,
    async (job) => {
      console.log(`[PipelineStaleCheck] Processing job ${job.id}`)

      const threshold = new Date()
      threshold.setDate(threshold.getDate() - STALE_THRESHOLD_DAYS)

      const staleOpportunities = await prisma.pipelineOpportunity.findMany({
        where: {
          stage: { notIn: ['won', 'lost'] },
          updatedAt: { lt: threshold },
        },
        select: {
          id: true,
          name: true,
          stage: true,
          updatedAt: true,
          contactName: true,
        },
      })

      console.log(`[PipelineStaleCheck] Found ${staleOpportunities.length} stale opportunities`)

      for (const opp of staleOpportunities) {
        const daysSinceUpdate = Math.floor(
          (Date.now() - opp.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
        )

        // Create notification for principal users
        const principals = await prisma.user.findMany({
          where: { role: { in: ['principal', 'senior_architect'] } },
          select: { id: true },
        })

        for (const principal of principals) {
          await prisma.notification.create({
            data: {
              userId: principal.id,
              title: 'Stale Pipeline Opportunity',
              message: `"${opp.name}" has not been updated in ${daysSinceUpdate} days.`,
              type: 'warning',
            },
          })
        }
      }

      return {
        staleCount: staleOpportunities.length,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        staleIds: (staleOpportunities as any[]).map((o: any) => o.id as string),
      }
    },
    { connection }
  )

  worker.on('failed', (job, err) => {
    console.error(`[PipelineStaleCheck] Job ${job?.id} failed:`, err.message)
  })

  return worker
}
