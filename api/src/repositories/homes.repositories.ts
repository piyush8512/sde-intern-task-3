export type Home = { id: string; name: string }

export async function insertHome(db: D1Database, home: Home): Promise<void> {
  await db.prepare('INSERT INTO homes (id, name) VALUES (?1, ?2)').bind(home.id, home.name).run()
}