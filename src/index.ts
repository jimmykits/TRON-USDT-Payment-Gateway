import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

serve({
	fetch: app.fetch,
	port: 3333
}, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`)
})
