import { Hono } from 'hono'
import { balances } from './routes/balances.route'
import { bills } from './routes/bills.route'
import { homes } from './routes/homes.route'
import { payments } from './routes/payments.route'
import { HttpError, NotFoundError, RuleViolationError } from './utils/errors'

const app = new Hono<{ Bindings: Env }>()

app.get('/api/health', (c) => c.json({ status: 'ok' }))

app.route('/api/homes', homes)
app.route('/api', bills)
app.route('/api', payments)
app.route('/api', balances)

app.notFound((c) => c.json({ error: 'Not found' }, 404))

app.onError((error, c) => {
    if (error instanceof HttpError) return c.json({ error: error.message }, error.status)
    if (error instanceof NotFoundError) return c.json({ error: error.message }, 404)
    if (error instanceof RuleViolationError) return c.json({ error: error.message }, 422)
    console.error(error)
    return c.json({ error: 'Internal server error' }, 500)
})

export default app
