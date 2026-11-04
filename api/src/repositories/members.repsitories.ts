export type Member = { id: string; homeId: string; name: string }

export async function insertMember(db: D1Database, member: Member): Promise<void> {
  await db
    .prepare('INSERT INTO members (id, home_id, name) VALUES (?1, ?2, ?3)')
    .bind(member.id, member.homeId, member.name)
    .run()
}