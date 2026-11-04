export type Member = { id: string; homeId: string; name: string }

export async function insertMember(db: D1Database, member: Member): Promise<void> {
  await db
    .prepare('INSERT INTO members (id, home_id, name) VALUES (?1, ?2, ?3)')
    .bind(member.id, member.homeId, member.name)
    .run()
}

export async function listMemberIds(db: D1Database, homeId: string): Promise<string[]> {
  const { results } = await db
    .prepare('SELECT id FROM members WHERE home_id = ?1 ORDER BY rowid')
    .bind(homeId)
    .all<{ id: string }>()
  return results.map((row) => row.id)
}
