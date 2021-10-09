const { timeStamp } = require("console");
const mongoose = require("mongoose");

const ClassroomSchema = mongoose.Schema({

    creator : {
        type:  mongoose.Schema.Types.ObjectId,
        ref : "Tutor"        
    },
    description : String,
    className : String,
    subject : String,
    classroomID : String,
    
    studentRequests :  [{
        type:  mongoose.Schema.Types.ObjectId,
        ref : "Student" 
    }],

    enrolledStudents : [{
        type:  mongoose.Schema.Types.ObjectId,
        ref : "Student" 
    }],

    assignments : [{
        type:  mongoose.Schema.Types.ObjectId,
        ref : "Assignment" 
    }],
    
    tests : [{
        type:  mongoose.Schema.Types.ObjectId,
        ref : "Test" 
    }],
    comments : [{
        type:  mongoose.Schema.Types.ObjectId,
        ref : "Comment" 
    }],
    meeting : {
        link : String,
        timing : Date,
        ending : Date,
    }
},
    {
        timestamps : true
    }
);

module.exports = mongoose.model("Classroom", ClassroomSchema);
