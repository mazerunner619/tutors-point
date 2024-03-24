const jwt = require("jsonwebtoken");
const db = require("../../Models");
const bcrypt = require("bcrypt");
require("dotenv/config");

const login = {};
const { createError } = require("../../utils/utilFunctions");

login.login = async (req, res, next) => {
  try {
    const { as, email, password } = req.body;
    const user = await db[as].findOne({ email }).populate({
      path: as === "Student" ? "enrolledClasses requestedClasses" : "classes",
    });

    if (user) {
      console.log("login attempt for " + email);
      const correctPassword = await bcrypt.compare(password, user.password);
      if (correctPassword) {
        const token = jwt.sign(
          {
            userId: user._id,
          },
          process.env.JWT_SECRET_KEY
        );
        console.log("logged in as " + user.name);
        res
          .cookie("token", token, { httpOnly: true })
          .send({ data: user, jwtToken: token, message: "OK" });
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

login.signup = async (req, res, next) => {
  try {
    const { as, name, gender, email, phone, dob, password } = req.body;
    //console.log('Body',req.body);

    const user1 = await db[as].find({ email });
    const user2 = await db[as].find({ phone });
    if (user1.length > 0 || user2.length > 0) {
      return next(createError("email/phone already exists", 409));
    }
    const userData = {
      ...req.body,
      role: as.charAt(0).toLowerCase() + as.slice(1),
      password: await bcrypt.hash(password, 10),
    };

    const newUser = await db[as].create(userData);

    return res.json({
      message: "Registered successfully",
      status: true,
    });
  } catch (error) {
    //console.log(error);
    return next({
      message: error.message,
      status: false,
    });
  }
};

login.logout = async (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send({ data: "", message: "OK" });
};

login.currentLoggedInUser = async (req, res, next) => {
  try {
    // const token = req.cookies.token;
    const token = req.headers.authorization.split(" ")[1];
    console.log("current logged in user => ", token);
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
