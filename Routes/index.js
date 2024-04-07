const authRoute = require("../api/authentication/index");
const assRoute = require("../api/assignment/index");
const classRoute = require("../api/classroom/index");

module.exports = (app) => {
  app.use("/auth", authRoute);
  app.use("/asn", assRoute);
  app.use("/class", classRoute);
};
