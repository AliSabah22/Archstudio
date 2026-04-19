import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify'

interface AppError extends FastifyError {
  statusCode: number
}

export function errorHandler(
  error: AppError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  request.log.error({ err: error, url: request.url, method: request.method }, 'Request error')

  if (error.statusCode === 400) {
    reply.status(400).send({
      error: 'Bad Request',
      message: error.message,
    })
    return
  }

  if (error.statusCode === 401) {
    reply.status(401).send({
      error: 'Unauthorized',
      message: 'Authentication required',
    })
    return
  }

  if (error.statusCode === 403) {
    reply.status(403).send({
      error: 'Forbidden',
      message: 'You do not have permission to perform this action',
    })
    return
  }

  if (error.statusCode === 404) {
    reply.status(404).send({
      error: 'Not Found',
      message: error.message,
    })
    return
  }

  if (error.statusCode === 409) {
    reply.status(409).send({
      error: 'Conflict',
      message: error.message,
    })
    return
  }

  // Unhandled errors
  reply.status(500).send({
    error: 'Internal Server Error',
    message: process.env['NODE_ENV'] === 'production' ? 'Something went wrong' : error.message,
  })
}
