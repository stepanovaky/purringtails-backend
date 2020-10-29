require('dotenv').config();
const jwt = require('jsonwebtoken')


function authenticateJWT (token) {
    jwt.verify(token, process.env.KEY, { algorithms: ['HS256'] }, function (err, decoded) {
        if (err) {
         return console.error(err)
        };
        

})}

module.exports = authenticateJWT;