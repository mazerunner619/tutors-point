const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    by : String, // 1=> student 2 => tutor
    byStudent : {
        type:  mongoose.Schema.Types.ObjectId,
        ref : "Student" 
    },
    byTutor : {
        type:  mongoose.Schema.Types.ObjectId,
        ref : "Tutor" 
    },
    comment : String,
    date : { type : Date, default : Date.now}
},
{
    timestamps : true
}
);

module.exports = mongoose.model("Comment", commentSchema);
