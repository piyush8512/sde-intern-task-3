import { Hono } from 'hono'
import { homes } from './routes/homes.route'

const app = new Hono<{ Bindings: Env }>()

app.get('/api/health', (c) => c.json({ status: 'ok' }))
app.route('/api/homes', homes)


export default app
