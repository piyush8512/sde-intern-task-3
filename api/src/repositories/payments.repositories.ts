import type { Share } from './bills.repositories'

export async function findShare(
  db: D1Database,
  billId: string,
  shareId: string,
): Promise<(Share & { idempotencyKey: string | null }) | null> {
  const row = await db
    .prepare(
      'SELECT id, member_id, amount_cents, paid_at, idempotency_key FROM shares WHERE bill_id = ?1 AND id = ?2',
    )
    .bind(billId, shareId)
    .first<{
      id: string
      member_id: string
      amount_cents: number
      paid_at: string | null
      idempotency_key: string | null
    }>()

  if (!row) return null
  return {
    id: row.id,
    memberId: row.member_id,
    amountCents: row.amount_cents,
    paidAt: row.paid_at,
    idempotencyKey: row.idempotency_key,
  }
}

export async function markSharePaid(
  db: D1Database,
  billId: string,
  shareId: string,
  idempotencyKey: string,
  paidAt: string,
): Promise<void> {
  await db
    .prepare(
      'UPDATE shares SET paid_at = ?1, idempotency_key = ?2 WHERE bill_id = ?3 AND id = ?4 AND paid_at IS NULL',
    )
    .bind(paidAt, idempotencyKey, billId, shareId)
    .run()
}
