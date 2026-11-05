import { Hono } from 'hono'
import { findHome } from '../repositories/homes.repositories'
import { createHome } from '../service/home.service'
import { addMember } from '../service/members.service'
import { NotFoundError } from '../utils/errors'
import { parseNameBody, readJson } from '../utils/validation'
export const homes = new Hono<{ Bindings: Env }>()

homes.post('/', async (c) => {
  const name = parseNameBody(await readJson(c))
  const home = await createHome(c.env.DB, name)
  return c.json(home, 201)
})

homes.get('/:homeId', async (c) => {
  const home = await findHome(c.env.DB, c.req.param('homeId'))
  if (!home) throw new NotFoundError('Home not found')
  return c.json(home)
})

homes.post('/:homeId/members', async (c) => {
    const name = parseNameBody(await readJson(c))
    const member = await addMember(c.env.DB, c.req.param('homeId'), name)
    return c.json(member, 201)
})