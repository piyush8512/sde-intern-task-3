import type { ContentfulStatusCode } from 'hono/utils/http-status'

export class HttpError extends Error {
  status: ContentfulStatusCode

  constructor(status: ContentfulStatusCode, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class RuleViolationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RuleViolationError'
  }
}
