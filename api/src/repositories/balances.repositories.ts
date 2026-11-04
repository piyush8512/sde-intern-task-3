export type BalanceRow = {
  memberId: string
  name: string
  outstandingCents: number
}

export async function listBalances(db: D1Database, homeId: string): Promise<BalanceRow[]> {
  const { results } = await db
    .prepare(
      `SELECT m.id AS member_id, m.name,
        COALESCE(SUM(CASE WHEN s.paid_at IS NULL THEN s.amount_cents ELSE 0 END), 0) AS outstanding_cents
       FROM members m
       LEFT JOIN shares s ON s.member_id = m.id AND s.home_id = m.home_id
       WHERE m.home_id = ?1
       GROUP BY m.id, m.name, m.rowid
       ORDER BY m.rowid`,
    )
    .bind(homeId)
    .all<{ member_id: string; name: string; outstanding_cents: number }>()

  return results.map((row) => ({
    memberId: row.member_id,
    name: row.name,
    outstandingCents: row.outstanding_cents,
  }))
}
