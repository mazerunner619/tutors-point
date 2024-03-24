const jwt = require("jsonwebtoken");
const middleWares = {};
const { createError } = require("./utilFunctions");

middleWares.authenticateUser = (req, res, next) => {
  try {
    if (req.headers.authorization === undefined) {
      console.log("token not present");
      return next(createError("UNAUTHORIZED !", 401));
    }
    let token = req.headers.authorization.split(" ")[1];
    console.log("jw token => ", token);
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (verified.userId === req.params.userid) {
      console.log("token verified");
      req.jwtToken = token;
      next();
    } else {
      console.log("token not verified");
      return next(createError("UNAUTHORIZED !", 401));
    }
  } catch (error) {
    console.log("===>", error);
    return next(createError("UNAUTHORIZED !", 401));
  }
};

module.exports = middleWares;
