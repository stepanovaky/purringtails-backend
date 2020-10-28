require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config')
const jwt = require('jsonwebtoken');
const { DATABASE_URL } = require('./config');
const knex = require('knex');
const userRouter = require('./user-route');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               


const app = express();


const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(userRouter);


const pem = "-----BEGIN CERTIFICATE-----\nMIIDJjCCAg6gAwIBAgIIZ87kWVFIuvAwDQYJKoZIhvcNAQEFBQAwNjE0MDIGA1UE\nAxMrZmVkZXJhdGVkLXNpZ25vbi5zeXN0ZW0uZ3NlcnZpY2VhY2NvdW50LmNvbTAe\nFw0yMDEwMTUwNDI5NDVaFw0yMDEwMzExNjQ0NDVaMDYxNDAyBgNVBAMTK2ZlZGVy\nYXRlZC1zaWdub24uc3lzdGVtLmdzZXJ2aWNlYWNjb3VudC5jb20wggEiMA0GCSqG\nSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCwckWwDEw3XpsthA8cH/JNFspg/cTAfhdg\nwKxkeWPFjWXHwb4r6N/OhlKdTsSwV2yXqHClt4p0LTPG3idMLtcACoKSCxwRnwom\nuvHIO7E0yG7dou9zx7hw0GteXWKNLEmmwToC9QAGOdIiANldHQy2Z+p7enQBN8Qm\nXoSxnpGb7+CrMHshGWKLESD4sultg3Q0pn2rgu7BhxRPUJrmXGVVktcXintnJtd6\nXBHmUHhExo8nhEsG1KRqBYQw12M6tUpgeNLrM6Ciu0idGPLjGII0Q3JB6eFYRZje\nSfp3RLapDIyQ0f9F64wulRf/5VbL9iX489uKHkI7aArb8636wTPXAgMBAAGjODA2\nMAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMBYGA1UdJQEB/wQMMAoGCCsG\nAQUFBwMCMA0GCSqGSIb3DQEBBQUAA4IBAQAgseaOrtf9/JWn++hbzt9qGVUFh3xg\nGMySX7W0S0H0QZ0JomFOdk0Kmo5IG5wY+idXVG3teVRNN7BMFnfUoB+DIZ+M/gGy\n6+f3q2JCMuR9wiPAk0DVwae39zeDtSjrdgrlVccIuCquxb0pzVcHZsrRN6iMjqTS\n8yYJsRe4uwR2lH+U3voDIFeLMtx6cqOCoE+RczWtt/QXw9BFf7ISITzkXRahR0t4\nlAT4sF2lHgVewxOzonkyGOz7v3GqwVKZTzNFmqtuxVZ/tOSUw48ogMvW0eNgfNY3\nPP1wq6nT3PISv/rg1bUSLnI7+0UMiqzN71qhCP3YVAm/KOBayne8C6/h\n-----END CERTIFICATE-----\n"

app.get('/auth', function (req, res) {

  //middleware auth - list out all of the urls that require authentication - make sure they go through the auth - also making sure expiration is up to date -if a function requires a specific user - authenticate - attach id to email - email from that user matches the user making the changes
  jwt.verify(req.get('Authorization'), pem, { algorithms: ['RS256'] }, function (err, decoded) {
    if (err) {
     return console.error(err)
    };
    console.log(decoded);
  })
  
  if (req.get('Authorization') != undefined) {
    res.status(200).json()
  } else {
    res.status(401).json()
    
}})

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