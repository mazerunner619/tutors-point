const mongoose = require("mongoose");
const tutorSchema = {
  role : String,
  name : String,
  gender : String,
  dob : String,
  email : String,
  phone : String,
  password : String,

  classes : [{
    type:  mongoose.Schema.Types.ObjectId,
    ref : "Classroom"
  }],

}

const Tutor = mongoose.model("Tutor", tutorSchema);
module.exports = Tutor;
