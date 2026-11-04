import { Hono } from 'hono'
import { homes } from './routes/homes.route'
import { HttpError, NotFoundError } from './utils/errors'

const app = new Hono<{ Bindings: Env }>()

app.get('/api/health', (c) => c.json({ status: 'ok' }))

app.route('/api/homes', homes)



app.onError((error, c) => {
    if (error instanceof HttpError) return c.json({ error: error.message }, error.status)
    if (error instanceof NotFoundError) return c.json({ error: error.message }, 404)
    console.error(error)
    return c.json({ error: 'Internal server error' }, 500)
})

export default app
