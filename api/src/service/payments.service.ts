import { findShare, markSharePaid } from '../repositories/payments.repositories'
import { HttpError, NotFoundError } from '../utils/errors'

export async function payShare(
  db: D1Database,
  billId: string,
  shareId: string,
  idempotencyKey: string | undefined,
) {
  if (!idempotencyKey?.trim()) {
    throw new HttpError(400, 'Idempotency-Key header is required')
  }

  const existing = await findShare(db, billId, shareId)
  if (!existing) throw new NotFoundError('Share not found')

  if (existing.paidAt !== null) {
    if (existing.idempotencyKey === idempotencyKey) return existing
    throw new HttpError(409, 'Share has already been paid')
  }

  const paidAt = new Date().toISOString()
  await markSharePaid(db, billId, shareId, idempotencyKey, paidAt)

  const paid = await findShare(db, billId, shareId)
  if (!paid) throw new NotFoundError('Share not found')
  if (paid.idempotencyKey !== idempotencyKey) {
    throw new HttpError(409, 'Share has already been paid')
  }
  return paid
}
