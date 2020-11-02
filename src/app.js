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


pem = "-----BEGIN CERTIFICATE-----\nMIIDJjCCAg6gAwIBAgIIJd035gvRHpswDQYJKoZIhvcNAQEFBQAwNjE0MDIGA1UE\nAxMrZmVkZXJhdGVkLXNpZ25vbi5zeXN0ZW0uZ3NlcnZpY2VhY2NvdW50LmNvbTAe\nFw0yMDEwMjMwNDI5NDVaFw0yMDExMDgxNjQ0NDVaMDYxNDAyBgNVBAMTK2ZlZGVy\nYXRlZC1zaWdub24uc3lzdGVtLmdzZXJ2aWNlYWNjb3VudC5jb20wggEiMA0GCSqG\nSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCvVj+9WMlM2nCAoMXH/5am06q8E+KK8NTz\n+LkFGJUluU6sofmUzteEk79k/U0MCpYSYooD2PDfbVF7s8SiA+FJmrIIBKLC583r\n+zfceGEvUuC/qSdg4VpNG2mc/Dx7TEbzJ1r8s/kdBQZwbnQ3tH8Xa8ArJcFOOALO\ngtW2ueBqOijcnxJlyNzYfInITELrJt7itmjvW/P/6/MQ2vV8a/iOT5MEtCBIr9Ki\nA4WkpFtUXd0Vdn/6tQvKAzIYkWb5Y0Jq6cSjo0NdyAU1odl3v3uyRcdgCB07bCrD\nivk/WnyRbaowq6SnmQRy1jA1zQkJejJyW337N8md6sgEhOWcC2RDAgMBAAGjODA2\nMAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMBYGA1UdJQEB/wQMMAoGCCsG\nAQUFBwMCMA0GCSqGSIb3DQEBBQUAA4IBAQBh7tw75dc9TnNtiIlLjRvfAQlv99jv\nt8UXuXdDFxTa3/Qj4qd8JTfydcdaGNcYeiDum2SbFl3RXfm7S4l/iPVDa9SypwH4\nyPOb4CzrZKJ1+MYYGuVTAMI5iUtwZx/XoB/Xn+iSjsQzk2sg6ZugwoWJMTQmwvkT\ncsQtDhhj+XnoBUswG7NLf0ApUcgtx52QD1BFuf7AtOM3poL4huyp7a0deiI1UyJ1\n2mTDTqq678sGUDY7xHr4G0jwihSOqfqFRb2x9RyboZVe3Jpv8vebTFu60xdI3ezJ\nGar9rp/sncGWWMyyhaE2ZjQ2J5opOsvg7f7oPL398BAXwOSbMNTw7Hdx\n-----END CERTIFICATE-----\n"

const app = express();


const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption));
app.use(helmet());
// app.use(cors());

app.use(userRouter);
app.use(scheduleRouter);

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