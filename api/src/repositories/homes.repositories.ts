export type Home = { id: string; name: string }

export async function insertHome(db: D1Database, home: Home): Promise<void> {
  await db.prepare('INSERT INTO homes (id, name) VALUES (?1, ?2)').bind(home.id, home.name).run()
}

export async function findHome(db: D1Database, id: string): Promise<Home | null> {
    return db.prepare('SELECT id, name FROM homes WHERE id = ?1').bind(id).first<Home>()
}