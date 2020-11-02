const express = require('express');


const healthRouter = express.Router();


healthRouter
    .route('/health')
    .get((req, res, next) => {
        res
        .status(200)
        .json({message: 'this is working'})
    })

    module.exports = healthRouter;