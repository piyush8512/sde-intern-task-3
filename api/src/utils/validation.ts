import { HttpError } from '../utils/errors'
import type { Context } from 'hono'

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