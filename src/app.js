require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { DATABASE_URL } = require('./config');
const knex = require('knex');
const userRouter = require('./user-route');
const { NODE_ENV } = require('./config')
const scheduleRouter = require('./schedule-route')
const healthRouter = require('./health-route')



const app = express();


const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(userRouter);
app.use(scheduleRouter);
app.use(healthRouter); 

// const corsOptions = { origin: 'https://purringtails-frontend.vercel.app'}



app.use(function errorHandler(error, req, res, next) {
   let response
   if (NODE_ENV === 'production') {
     response = { error: { message: 'server error' } }
   } else {
     console.error(error)
     response = { message: error.message, error }
   }
   res.status(500).json(response)
 })

 const db = knex({
   client: 'pg',
   connection: DATABASE_URL
 })

 app.set('db', db);



module.exports = app