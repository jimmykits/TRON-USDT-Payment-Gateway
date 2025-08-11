import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.post("/pay/in", (c) => { return c.text('in') })
app.post("/pay/out", (c) => { return c.text('out') })
app.get("/pay/detail", (c) => { return c.text('detail') })



/**
 * manager API
 */
app.post("/manager/login", (c) => { return c.text('login') })

app.post("/manager/logout", (c) => { return c.text('create') })
app.post("/manager/modify/password", (c) => { return c.text('create') })

app.post("/manager/userinfo", (c) => { return c.text('create') })


app.post("/manager/order/query", (c) => { return c.text('create') })
// send callback to merchant
app.post("/manager/order/callback", (c) => { return c.text('create') })

// Wallet List
app.post("/manager/wallet", (c) => { return c.text('login') })
// Create wallet
app.post("/manager/wallet/create", (c) => { return c.text('login') })
// query wallet chain
app.get("/manager/wallet/chain", (c) => { return c.text('login') })
// sync wallet balance
app.post("/manager/wallet/sync", (c) => { return c.text('login') })
// payout batch
app.post("/manager/payout", (c) => { return c.text('login') })
// activation wallet
app.post("/manager/wallet/activation", (c) => { return c.text('login') })

app.get("/manager/mfa", (c) => { return c.text('login') })
app.post("/manager/mfa", (c) => { return c.text('login') })
















serve({
	fetch: app.fetch,
	port: 3333
}, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`)
})
