const mongoose = require("mongoose");

const AssignmentSchema = mongoose.Schema({

    creator : {
        type:  mongoose.Schema.Types.ObjectId,
        ref : "Tutor"        
    },

    classRoom : {
        type:  mongoose.Schema.Types.ObjectId,
        ref : "Classroom" 
    },
 
    description : String,
    subject : String,
    topic : String,

    file : {
        fileID : String,
        fileURL : String
    }, 
    doneby : [{
      student : {
        type:  mongoose.Schema.Types.ObjectId,
        ref : "Student"
        },
        file : {
            fileID : String,
            fileURL : String
        },
        evaluated : {type : Boolean, default : false},
        score :{ type : Number, default : null},
        remarks : { type : String, default : null}, 
    }]
},
{
    timestamps : true
}
);

module.exports = mongoose.model("Assignment", AssignmentSchema);
