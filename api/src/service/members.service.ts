import { NotFoundError } from '../utils/errors'
import { findHome } from '../repositories/homes.repositories'
import { insertMember, type Member } from '../repositories/members.repsitories'

export async function addMember(db: D1Database, homeId: string, name: string): Promise<Member> {
  const home = await findHome(db, homeId)
  if (!home) throw new NotFoundError('Home not found')

  const member: Member = { id: crypto.randomUUID(), homeId, name }
  await insertMember(db, member)
  return member
}