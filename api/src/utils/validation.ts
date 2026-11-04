import type { Context } from 'hono'
import { HttpError } from '../utils/errors'

export function parseNameBody(body: unknown): string {
    if (
      typeof body !== 'object' ||
      body === null ||
      !('name' in body) ||
      typeof body.name !== 'string' ||
      body.name.trim() === ''
    ) {
      throw new HttpError(422, 'name must be a non-empty string')
    }
    return body.name.trim()
  }



export async function readJson(c: Context): Promise<unknown> {
    try {
      return await c.req.json()
    } catch {
      throw new HttpError(400, 'Request body must be valid JSON')
    }
  }

export function parseBillBody(body: unknown): { title: string; totalCents: number } {
  if (typeof body !== 'object' || body === null) {
    throw new HttpError(422, 'Request body must be a JSON object')
  }
  const { title, totalCents } = body as { title?: unknown; totalCents?: unknown }

  if (typeof title !== 'string' || title.trim() === '') {
    throw new HttpError(422, 'title must be a non-empty string')
  }

  if (typeof totalCents !== 'number' || !Number.isSafeInteger(totalCents) || totalCents <= 0) {
    throw new HttpError(422, 'totalCents must be a positive whole number of cents')
  }
  return { title: title.trim(), totalCents }
}
