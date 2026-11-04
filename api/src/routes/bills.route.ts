import { Hono } from 'hono'
import { listBills } from '../repositories/bills.repositories'
import { findHome } from '../repositories/homes.repositories'
import { createBill } from '../service/bills.service'
import { NotFoundError } from '../utils/errors'
import { parseBillBody, readJson } from '../utils/validation'

export const bills = new Hono<{ Bindings: Env }>()

bills.get('/homes/:homeId/bills', async (c) => {
  const homeId = c.req.param('homeId')
  if (!(await findHome(c.env.DB, homeId))) throw new NotFoundError('Home not found')
  return c.json({ bills: await listBills(c.env.DB, homeId) })
})

bills.post('/homes/:homeId/bills', async (c) => {
  const { title, totalCents } = parseBillBody(await readJson(c))
  const bill = await createBill(c.env.DB, c.req.param('homeId'), title, totalCents)
  return c.json(bill, 201)
})
