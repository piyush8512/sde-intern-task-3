import { Hono } from 'hono'
import { payShare } from '../service/payments.service'

export const payments = new Hono<{ Bindings: Env }>()

payments.post('/bills/:billId/shares/:shareId/pay', async (c) => {
  const share = await payShare(
    c.env.DB,
    c.req.param('billId'),
    c.req.param('shareId'),
    c.req.header('Idempotency-Key'),
  )
  return c.json(share)
})
