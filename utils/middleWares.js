const jwt = require("jsonwebtoken");
const middleWares = {};
const { createError } = require("./utilFunctions");

middleWares.checkCorrectOtpUser = (req, res, next) => {
  try {
    const token = req.cookies.otpToken;
    if (!token)
      return next(createError("unauthorized otp user", error.statusCode));
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decodeToken.email !== req.body.email)
      return next(createError("unauthorized otp user", 400));
    if (Date.now() > decodeToken.expires)
      return next(createError("otp expired", 400));
    req.otpHash = decodeToken.otpHash;
    next();
  } catch (error) {
    return next(createError("unauthorized otp user", 400));
  }
};

middleWares.checkTokenExpiry = (req, res, next) => {
  try {
    // console.log(req.url);
    // if (["/auth/login", "/auth/signup"].indexOf(req.url) !== -1) {
    //   next();
    // } else {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (verifiedToken.expiry > Date.now()) {
        req.jwtToken = verifiedToken;
        // console.log("token not expired!");
        next();
      } else {
        // console.log("token expired!");
        return next(createError("token expired !", 401));
      }
    } else {
      // console.log("token  not found!");
      return next(createError("UNAUTHORIZED !", 401));
    }
    // }
  } catch (error) {
    // console.log("something wrong :", error.message);
    return next(createError(error.message, error.statusCode));
  }
};

middleWares.authenticateUser = (req, res, next) => {
  try {
    // console.log("token present => ", req.jwtToken !== undefined);
    if (req.jwtToken?.userId === req.params.userid) {
      // console.log("jwt verified!");
      next();
    } else {
      return next(createError("UNAUTHORIZED !", 401));
    }
  } catch (error) {
    // console.log("===>", error);
    return next(createError("UNAUTHORIZED !", 401));
  }
};

module.exports = middleWares;
