import { Worker, Queue } from 'bullmq'
import { getRedis, cacheSet } from '../lib/redis.js'
import { prisma } from '../lib/db.js'

export const UTILIZATION_SNAPSHOT_QUEUE = 'utilization-snapshot'

export function createUtilizationSnapshotQueue() {
  const connection = getRedis()
  return new Queue(UTILIZATION_SNAPSHOT_QUEUE, { connection })
}

export function startUtilizationSnapshotWorker() {
  const connection = getRedis()

  const worker = new Worker(
    UTILIZATION_SNAPSHOT_QUEUE,
    async (job) => {
      console.log(`[UtilizationSnapshot] Processing job ${job.id}`)

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const targetHours = 160

      const users = await prisma.user.findMany({ select: { id: true, name: true, role: true } })

      const snapshots = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (users as any[]).map(async (user: any) => {
          const entries: any[] = await prisma.timeEntry.findMany({
            where: { userId: user.id, date: { gte: startOfMonth } },
          })
          let billableHours = 0
          let totalHours = 0
          for (const e of entries) {
            const h = Number(e.hours)
            totalHours += h
            if (e.billable) billableHours += h
          }
          const utilization = Math.round((billableHours / targetHours) * 100)

          return {
            userId: user.id,
            name: user.name,
            role: user.role,
            billableHours,
            totalHours,
            targetHours,
            utilization,
          }
        })
      )

      const firmAvg = Math.round(
        snapshots.reduce((s, u) => s + u.utilization, 0) / snapshots.length
      )

      const snapshot = {
        timestamp: now.toISOString(),
        firmUtilization: firmAvg,
        members: snapshots,
      }

      await cacheSet('utilization:snapshot', snapshot, 300) // 5 min TTL
      console.log(`[UtilizationSnapshot] Snapshot cached. Firm avg: ${firmAvg}%`)

      return snapshot
    },
    { connection }
  )

  worker.on('failed', (job, err) => {
    console.error(`[UtilizationSnapshot] Job ${job?.id} failed:`, err.message)
  })

  return worker
}
