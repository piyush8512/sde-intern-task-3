import { Hono } from 'hono'
import { createHome } from '../service/home.service'
import { parseNameBody, readJson } from '../utils/validation'

export const homes = new Hono<{ Bindings: Env }>()

homes.post('/', async (c) => {
  const name = parseNameBody(await readJson(c))
  const home = await createHome(c.env.DB, name)
  return c.json(home, 201)
})