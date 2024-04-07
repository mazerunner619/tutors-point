const jwt = require("jsonwebtoken");
const db = require("../../Models");
const bcrypt = require("bcrypt");
const { createError } = require("../../utils/utilFunctions");
const { sendOtpMail } = require("../../utils/mailHelper");

const login = {};

const generateOtp = (numOfDigits) => {
  const y = Math.pow(10, numOfDigits - 1);
  return Math.floor(Math.random() * 9 * y + y).toString();
};

login.login = async (req, res, next) => {
  try {
    const { role, email, password } = req.body;
    const user = await db[role].findOne({ email }).populate({
      path: role === "Student" ? "enrolledClasses requestedClasses" : "classes",
    });

    if (user) {
      console.log("login attempt for " + email);
      const correctPassword = await bcrypt.compare(password, user.password);
      if (correctPassword) {
        const token = jwt.sign(
          {
            userId: user._id,
            expiry: Date.now() + process.env.TOKEN_VALIDITY * 60 * 60 * 1000,
          },
          process.env.JWT_SECRET_KEY
        );
        // res
        // .cookie("token", token, { httpOnly: true })
        res.send({ data: user, jwtToken: token, message: "OK" });
      } else {
        return next(createError("incorrect password", 400));
      }
    } else {
      return next(createError("username/email does not exist", 404));
    }
  } catch (error) {
    return next(createError(error.message, error.statusCode));
  }
};

login.sendSignupOtp = async (req, res, next) => {
  try {
    const { role, email, phone } = req.body;
    // console.log("send otp : ", req.body);
    const user = await db[role].find({ $or: [{ email }, { phone }] });
    if (user.length > 0) {
      return next(createError("email/phone already exists", 409));
    }

    // generate otp
    const otp = generateOtp(4);
    const otpHash = await bcrypt.hash(otp, 10);

    //send otp
    const mailData = {
      email: email,
      subject: "OTP for signup",
      otp: otp,
      purpose: "signup",
    };

    const mailRes = await sendOtpMail(mailData);

    if (mailRes?.length > 0) {
      const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
      const token = jwt.sign(
        {
          email,
          otpHash,
          expires,
        },
        process.env.JWT_SECRET_KEY
      );

      const resData = {
        token,
        email,
        expires,
      };
      res
        .cookie("otpToken", token, { httpOnly: true })
        .send({ data: resData, message: "OK" });
    } else {
      return next(createError("could not send OTP!", 500));
    }
  } catch (error) {
    // console.log("generateOtp error : ", error);
    return next(createError(error.message, error.statusCode));
  }
};

login.verifySignupOtp = async (req, res, next) => {
  try {
    const { userData, otp } = req.body;
    const isOtpCorrect = await bcrypt.compare(otp, req.otpHash);
    if (!isOtpCorrect) {
      return next(createError("incorrect otp", 400));
    }
    const role = userData.role;

    const user = {
      ...userData,
      role: role.charAt(0).toLowerCase() + role.slice(1),
      password: await bcrypt.hash(userData.password, 10),
    };

    await db[userData.role].create(user);

    return res
      .cookie("otpToken", "", {
        httpOnly: true,
      })
      .send({
        data: "",
        message: "OK",
      });
  } catch (error) {
    return next(createError(error.message, error.statusCode));
  }
};

login.logout = async (req, res) => {
  res.send({ data: "", message: "OK" });
};

login.currentLoggedInUser = async (req, res, next) => {
  try {
    // const token = req.cookies.token;
    const token = req.headers.authorization.split(" ")[1];
    // console.log("current logged in user => ", token);
    if (token) {
      const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (verified) {
        const user1 = await db.Student.findById(verified.userId)
          .populate({
            path: "requestedClasses enrolledClasses",
            select: "-studentRequests",
          })
          .exec();
        if (user1) return res.send({ data: user1, message: "OK" });

        const user2 = await db.Tutor.findById(verified.userId)
          .populate({ path: "classes" })
          .exec();
        return res.send({ data: user2, message: "OK" });
      } else {
        res.send({ data: null, message: "OK" });
      }
    } else {
      res.send({ data: null, message: "OK" });
    }
  } catch (error) {
    res.send({ data: null, message: "OK" });
  }
};

module.exports = login;
