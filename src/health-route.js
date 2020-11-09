const express = require("express");

const healthRouter = express.Router();

//A route specifically for testing if the server API is running correctly

healthRouter.route("/health").get((req, res, next) => {
  res.status(200).json({ message: "this is working" });
});

module.exports = healthRouter;
