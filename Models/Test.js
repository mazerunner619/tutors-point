const mongoose = require("mongoose");

const TestSchema = mongoose.Schema({
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
    duration : String,
    marks : String,
    file : {
        fileID : String,
        fileURL : String
    }
},
{
    timestamps : true
}
);

module.exports = mongoose.model("Test", TestSchema);
