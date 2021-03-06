require("dotenv").config();
const jwt = require("jsonwebtoken");

//Takes in the authorization header to determine if the JWT is valid

function authenticateJWT(req, res, next) {
  const authorization = req.headers["authorization"];
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.KEY, { algorithms: ["HS256"] }, function (
    err,
    decoded
  ) {
    if (err) {
      return res.status(401);
    } else {
      return next();
    }
  });
}

module.exports = authenticateJWT;
