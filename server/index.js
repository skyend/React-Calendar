
const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')
const config = require('../config');
const port = config.PORT;
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


let db = [];
app.prepare().then(() => {
    const server = express()


    server.use(bodyParser.json());
    server.post('/api/schedule/save', ( req, res, next ) => {
        const saveItem = req.body;

        const others = db.filter((item) => saveItem.id !== item.id );
        db = [
            ...others,
            saveItem,
        ];
        console.log(db);
        res.status(200).json({code:'success'});
    });

    server.delete('/api/schedule/:id', ( req, res, next ) => {
        const itemId = req.params.id;

        db = db.filter((item) => itemId !== item.id );
        console.log(db);
        res.status(200).json({code:'success'});
    });

    server.get('/api/schedule/all', ( req, res, next ) => {
        res.status(200).json({code:'success', items: db});
        console.log(db);
    });

    server.get('/api/schedule/:id', ( req, res, next ) => {
        const itemId = req.params.id;
        const found = db.find((item) => itemId === item.id );

        if( found ){
            res.status(200).json({code:'success', item:found});
        } else {
            res.status(404).json({code:'fail'});
        }
    });

    server.get('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, err => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})
