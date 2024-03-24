const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");

module.exports = (app, express) => {
  if (["development"].indexOf(process.env.NODE_ENV) !== -1) {
    require("dotenv").config({
      path: path.join(__dirname, `.env.${process.env.NODE_ENV}`),
    });
  } else {
    require("dotenv").config();
  }

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  mongoose.connect(
    process.env.CONN_STRING,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },

    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log("connected to DB !");
      }
    }
  );

  if (process.env.NODE_ENV == "production") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
  }
};
