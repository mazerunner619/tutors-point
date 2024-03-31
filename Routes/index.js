const authRoute = require("../api/authentication/index");
const assRoute = require("../api/assignment/index");
const classRoute = require("../api/classroom/index");
const { createError } = require("../utils/utilFunctions");

module.exports = (app) => {
  app.use("/auth", authRoute);
  app.use("/asn", assRoute);
  app.use("/class", classRoute);
  app.get("/*", (req, res, next) => {
    return next(createError("Not Found!", 404));
  });
};
