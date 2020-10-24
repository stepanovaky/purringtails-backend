require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config')
var passport = require('passport');
const { deserializeUser } = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy


const app = express();

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors({ origin: "http://localhost:3000"}));

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

passport.use(new GoogleStrategy({
  clientID: '1031900326041-m3tpi4kjudu1f5uqj3jjp0pufpqs0ah8.apps.googleusercontent.com',
  clientSecret: 'sRDv-TcJz3kYFPKmsuKd21Vf',
  callbackURL: 'http://localhost:3000/auth/google/callback'  
},
  function(accessToken, refreshToken, profile, done){
    deserializeUser.findOrCreate({ googleId: profile.id }, function (err, user) {
      console.log(accessToken)
      return done(err, user)
    })
  }
  ))

  app.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email']}),
    function(req, res) {
      res.send('hello')
    })

  app.get('/auth/google/callback',
    passport.authenticate('google', {scope: ['profile']}, { failureRedirect: 'http://localhost:3000/login' }),
    function(req, res) {
      res.redirect('http:localhost:3000/')
    })

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

module.exports = app