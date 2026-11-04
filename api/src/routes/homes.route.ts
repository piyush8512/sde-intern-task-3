import { Hono } from 'hono'
import { createHome } from '../service/home.service'
import { parseNameBody, readJson } from '../utils/validation'
import { addMember } from '../service/members.service'
export const homes = new Hono<{ Bindings: Env }>()

homes.post('/', async (c) => {
  const name = parseNameBody(await readJson(c))
  const home = await createHome(c.env.DB, name)
  return c.json(home, 201)
})

homes.post('/:homeId/members', async (c) => {
    const name = parseNameBody(await readJson(c))
    const member = await addMember(c.env.DB, c.req.param('homeId'), name)
    return c.json(member, 201)
})