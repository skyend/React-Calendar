const express = require('express')
const next = require('next')
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


let db = {};

app.prepare().then(() => {
    const server = express()


    server.post('/api/schedule/save', ( req, res, next ) => {

    });

    server.post('/api/schedule/delete', ( req, res, next ) => {

    });

    server.get('/api/schedule/all', ( req, res, next ) => {

    });


    server.get('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, err => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})