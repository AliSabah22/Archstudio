import { Redis } from 'ioredis'

const REDIS_URL = process.env['REDIS_URL'] ?? 'redis://localhost:6379'

let redisInstance: Redis | null = null

export function getRedis(): Redis {
  if (!redisInstance) {
    redisInstance = new Redis(REDIS_URL, {
      retryStrategy: (times: number) => {
        if (times > 5) return null
        return Math.min(times * 500, 2000)
      },
      lazyConnect: true,
    })

    redisInstance.on('error', (err: Error) => {
      console.error('[Redis] Connection error:', err.message)
    })

    redisInstance.on('connect', () => {
      console.log('[Redis] Connected')
    })
  }
  return redisInstance
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedis()
  const value = await redis.get(key)
  if (!value) return null
  return JSON.parse(value) as T
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  const redis = getRedis()
  await redis.setex(key, ttlSeconds, JSON.stringify(value))
}

export async function cacheDel(key: string): Promise<void> {
  const redis = getRedis()
  await redis.del(key)
}
