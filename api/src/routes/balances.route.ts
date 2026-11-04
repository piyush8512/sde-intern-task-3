import { Hono } from 'hono'
import { listBalances } from '../repositories/balances.repositories'
import { findHome } from '../repositories/homes.repositories'
import { NotFoundError } from '../utils/errors'

export const balances = new Hono<{ Bindings: Env }>()

balances.get('/homes/:homeId/balances', async (c) => {
  const homeId = c.req.param('homeId')
  if (!(await findHome(c.env.DB, homeId))) throw new NotFoundError('Home not found')
  return c.json({ balances: await listBalances(c.env.DB, homeId) })
})
