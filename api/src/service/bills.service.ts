import { type Bill, insertBill } from '../repositories/bills.repositories'
import { findHome } from '../repositories/homes.repositories'
import { listMemberIds } from '../repositories/members.repsitories'
import { NotFoundError, RuleViolationError } from '../utils/errors'
import { splitCents } from '../utils/split'

export async function createBill(
  db: D1Database,
  homeId: string,
  title: string,
  totalCents: number,
): Promise<Bill> {
  const home = await findHome(db, homeId)
  if (!home) throw new NotFoundError('Home not found')

  const memberIds = await listMemberIds(db, homeId)
  if (memberIds.length === 0) {
    throw new RuleViolationError('Home has no members to split the bill between')
  }

  const amounts = splitCents(totalCents, memberIds.length)
  const bill: Bill = {
    id: crypto.randomUUID(),
    homeId,
    title,
    totalCents,
    shares: memberIds.map((memberId, index) => ({
      id: crypto.randomUUID(),
      memberId,
      amountCents: amounts[index] ?? 0,
      paidAt: null,
    })),
  }

  await insertBill(db, bill)
  return bill
}
