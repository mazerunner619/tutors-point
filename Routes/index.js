const authRoute = require("../api/authentication/index");
const assRoute = require("../api/assignment/index");
const classRoute = require("../api/classroom/index");
const { createError } = require("../utils/utilFunctions");
const { checkTokenExpiry } = require("../utils/middleWares");

module.exports = (app) => {
  app.use("/auth", authRoute);
  app.use("/asn", assRoute);
  app.use(checkTokenExpiry);
  app.use("/class", classRoute);
};
