import { type Home, insertHome } from '../repositories/homes.repositories'

export async function createHome(db: D1Database, name: string): Promise<Home> {
  const home: Home = { id: crypto.randomUUID(), name }
  await insertHome(db, home)
  return home
}