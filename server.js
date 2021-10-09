const express = require('express');
const app = express();
const db = require('./Models');
const authRoute = require('./Routes/authRoute');
// const Route = require('./Routes/router');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv/config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cors());

app.use(function(err , req , res , next){
    return res.status(err.status || 500).json({
        error : {
            message : err.message || "Opps! Something went wrong."
        }
    });
});

app.get('/del', async (req, res) => {
    await db.Comment.deleteMany({});
    res.send('done');
    });

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use('/auth', authRoute);
// app.use('/', Route);


app.get('/logout' , (req, res) => {
    res.cookie("token", "",{
    httpOnly : true,
    expires : new Date(0)
    }).send();
    console.log('logged out');
})

app.use(function(err , req , res , next){
    return res.send({
        message : err.message || "Opps! Something went wrong.",
        status : err.status
    });
});

mongoose.connect(process.env.CONN_STRING, 
    {
        useNewUrlParser : true,
        useUnifiedTopology : true
    }, 
    
    function(error){
        if(error){ 
            console.log(error);
        }
        else{
            console.log("connected to DB vidyayan !");
        }
    }
 ); 


if(process.env.NODE_ENV == "production"){
    app.use(express.static("quoteblog/build"));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'quoteblog', 'build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port:`+PORT);
});