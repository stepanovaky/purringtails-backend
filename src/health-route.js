const express = require('express');


const healthRouter = express.Router();


healthRouter
    .route('/health')
    .get((req, res, next) => {
        res.json({message: 'this is working'})
    })
