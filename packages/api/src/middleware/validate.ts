import type { FastifyRequest, FastifyReply } from 'fastify'
import type { ZodSchema, ZodError } from 'zod'

export function validateBody<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const result = schema.safeParse(request.body)
    if (!result.success) {
      const errors = formatZodErrors(result.error)
      reply.status(400).send({ error: 'Validation Error', details: errors })
    } else {
      request.body = result.data
    }
  }
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const result = schema.safeParse(request.query)
    if (!result.success) {
      const errors = formatZodErrors(result.error)
      reply.status(400).send({ error: 'Validation Error', details: errors })
    } else {
      (request as FastifyRequest & { validatedQuery: T }).validatedQuery = result.data
    }
  }
}

function formatZodErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const path = issue.path.join('.')
    out[path] = issue.message
  }
  return out
}
