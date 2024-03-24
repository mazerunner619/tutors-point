const express = require("express");
const app = express();

// dependencies
require("./dependencies")(app, express);
require("./Routes/index")(app);

//Global Error Handler
app.use(function (err, req, res, next) {
  console.log("error => ", err.message);
  return res.status(err.statusCode || 500).json({
    error: {
      message: err.message,
      status: err.statusCode,
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port:` + PORT);
});

/*
dummy data for testing
student - Atif, atif@gmail.com, #Redmi619
tutor - Tahrim, tahrim@gmail.com, #Redmi619
classes - 425819824, 830191725, 808016969
*/
