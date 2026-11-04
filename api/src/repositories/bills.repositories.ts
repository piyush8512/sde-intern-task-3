export type Share = { id: string; memberId: string; amountCents: number; paidAt: string | null }
export type Bill = {
  id: string
  homeId: string
  title: string
  totalCents: number
  shares: Share[]
}

export async function insertBill(db: D1Database, bill: Bill): Promise<void> {
  await db.batch([
    db
      .prepare('INSERT INTO bills (id, home_id, title, total_cents) VALUES (?1, ?2, ?3, ?4)')
      .bind(bill.id, bill.homeId, bill.title, bill.totalCents),
    ...bill.shares.map((share) =>
      db
        .prepare(
          'INSERT INTO shares (id, bill_id, member_id, home_id, amount_cents) VALUES (?1, ?2, ?3, ?4, ?5)',
        )
        .bind(share.id, bill.id, share.memberId, bill.homeId, share.amountCents),
    ),
  ])
}

export async function listBills(db: D1Database, homeId: string): Promise<Bill[]> {
  const { results } = await db
    .prepare(
      `SELECT b.id, b.home_id, b.title, b.total_cents,
        s.id AS share_id, s.member_id, s.amount_cents, s.paid_at
       FROM bills b
       LEFT JOIN shares s ON s.bill_id = b.id
       WHERE b.home_id = ?1
       ORDER BY b.seq, s.rowid`,
    )
    .bind(homeId)
    .all<{
      id: string
      home_id: string
      title: string
      total_cents: number
      share_id: string | null
      member_id: string | null
      amount_cents: number | null
      paid_at: string | null
    }>()

  const bills = new Map<string, Bill>()
  for (const row of results) {
    let bill = bills.get(row.id)
    if (!bill) {
      bill = {
        id: row.id,
        homeId: row.home_id,
        title: row.title,
        totalCents: row.total_cents,
        shares: [],
      }
      bills.set(row.id, bill)
    }

    if (row.share_id && row.member_id !== null && row.amount_cents !== null) {
      bill.shares.push({
        id: row.share_id,
        memberId: row.member_id,
        amountCents: row.amount_cents,
        paidAt: row.paid_at,
      })
    }
  }

  return [...bills.values()]
}
