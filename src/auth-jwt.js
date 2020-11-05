require('dotenv').config();
const jwt = require('jsonwebtoken')


function authenticateJWT (req, res, next) {
    const authorization = req.headers['authorization']
    const token = authorization.split(' ')[1]
    jwt.verify(token, process.env.KEY, { algorithms: ['HS256'] }, function (err, decoded) {
        if (err) {
         return console.error(err)
        } else {
            return next();
        }
        

})}

module.exports = authenticateJWT; 