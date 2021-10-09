const mongoose = require("mongoose");

const studentSchema = {
  role : String,
  name : String,
  gender : String,
  dob : String,
  email : String,
  phone : String,
  password : String,

  enrolledClasses : [{
    type:  mongoose.Schema.Types.ObjectId,
    ref : "Classroom"
  }],
  turnedAssignments :  [{
    type:  mongoose.Schema.Types.ObjectId,
    ref : "Assignment"
  }],

  requestedClasses : [{
    type:  mongoose.Schema.Types.ObjectId,
    ref : "Classroom"
}],

}

module.exports = mongoose.model("Student", studentSchema);

