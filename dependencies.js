const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

module.exports = (app, express) => {
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
};
