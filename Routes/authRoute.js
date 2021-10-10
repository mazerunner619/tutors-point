const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../Models');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cloudinary = require('cloudinary');
require('dotenv/config');


//====================== cloudinary and multer setup
//cloudinary config
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });

//upload to cloudinary
const upload_get_url = (image) => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(image , (err, url) => {
        if (err) return reject(err);
        return resolve(url);
      });
    });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-atif-' + Math.round(Math.random() * 1E9)
      console.log('filename',file.fieldname);
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
//   const upload = multer({ storage: storage });
const upload = multer({ storage : storage })
//====================== cloudinary and multer setup end


function authenticateUser(req, res ,next){
        const token = req.cookies.token;
        if(!token)
        return res.status(401).send('UNAUTHORIZED');
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(verified.userId === req.params.userid)
        next();
        else res.status(401).send('UNAUTHORIZED'); 
}


router.get('/student/:userid/refreshassignments/:classroomid' ,async(req, res, next) => {
    try{


        const {userid, classroomid} = req.params;
        console.log('refreshing.....', userid, classroomid);
        const classroom = await db.Classroom.findById(classroomid)
        .populate({path : "enrolledStudents assignments"}).exec();
        const student = await db.Student.findById(userid);
        console.log(classroom, student);
        if(!classroom || !student){
            return next({
                message : 'could not find class or student !',
            });
        }

        let upateAss = [];
        let turnedAsignments = 0;

        classroom.assignments.forEach( assi => {

            let ind = student.turnedAssignments.indexOf(assi._id);
            console.log(ind);

            if(ind !== -1){
                turnedAsignments++;
                //calculate student result if evaluated
                const studentsResult = assi.doneby.filter( doer => doer.student.toString() === userid.toString());
                const result = {
                    score : studentsResult[0].score,
                    remarks : studentsResult[0].remarks 
                }

                upateAss.push({
                    _id : assi._id,
                    description : assi.description,
                    subject : assi.subject,
                    topic : assi.topic,
                    file : assi.file,
                    turned : true,
                    evaluated : studentsResult[0].evaluated,
                    result : result
                });
            }else{

                upateAss.push({
                        _id : assi._id,
                        description : assi.description,
                        subject : assi.subject,
                        topic : assi.topic,
                        file : assi.file,
                        turned : false,
                        evaluated : false
                    });

                }
        });


console.log(upateAss, 'sending ...');
        res.send(upateAss.reverse());   
    }catch(err){
        return next({
            message : err.message
        })
    }
})

//===================== upload new assignment to class  ????? authenticate tutor
router.post('/classroom/:classroomID/new/assignment', upload.single('assignment'),async(req, res, next) => {
    try{
        // console.log('new assignmnet',req.body.formdata);
        const {topic , subject , description } = req.body;
        console.log('new ass :=>',topic,subject, description);
        console.log('new file',req.file);

        const {classroomID} = req.params;
        const classroom = await db.Classroom.findById(classroomID);
 
        if(!classroom)
        return next({
            message : 'classroom not found  !',
            status : false
        });

        const FILE = req.file;
        const {public_id, secure_url} = await upload_get_url(FILE.path);   
        const file = {
            fileID : public_id,
            fileURL : secure_url
        }

        const newAss = await db.Assignment.create({
            topic , subject , description , file, classRoom : classroomID, creator : classroom.creator
        });

        classroom.assignments.push(newAss._id);
        await classroom.save();

        console.log('new Ass=>',newAss);
        console.log('classroom=>',classroom);
        res.json({
            message : 'assignment uploaded'
        });

    }catch(err){
        console.log(err);
        return next({
            message : err.message,
            status : false
        });
    }


});

//====================submit assignment by student ??? authenticate student
router.post('/:userid/assignment/:AID/submit', authenticateUser ,upload.single('assignment') ,async(req, res, next) => {
try{

    console.log('submitting !');
    const {AID, userid} = req.params;
    const FILE = req.file;
    console.log('file=>', FILE);
    const student = await db.Student.findById(userid);
    const assignment = await db.Assignment.findById(AID);
    if(!assignment || !student)
    return next({
        message : 'Something went wrong !',
        status : false
    });

    if(student.turnedAssignments.indexOf(AID) !== -1){
        console.log('already turned in !');
        return res.json({
            message : 'already turned in !',
            status : false
        })
    }

    const {public_id, secure_url} = await upload_get_url(FILE.path);   
    const file = {
        fileID : public_id,
        fileURL : secure_url
    };
    assignment.doneby.push({
        student : userid,
        file
    });

    await assignment.save();
    student.turnedAssignments.push(AID);
    await student.save();
      
    res.json({
        message : 'turned in successfully !'
    });


}catch(err){
    console.log(err);
    return next({
        message : err.message,
        status : false
    });
}
    
});

//=========================evaluate assignment => tutor ???authenticateUser
router.post('/:userid/assignment/:AID/evaluate/:SID', authenticateUser,async(req, res, next) => {
    try{
    console.log('operation started !');

        const {score, remarks} = req.body;
    const {userid,SID, AID} = req.params;

    let student = await db.Student.findById(SID);
    let assignment = await db.Assignment.findById(AID);

    if(assignment.creator.toString() !== userid.toString()){
        return next({
            message : 'avoid such activities !'
        })
    }

    if(!student || !assignment)
    return next({
        message:'something went wrong !',
        status : false
    });

    const updateDoneBy = assignment.doneby.map( upd => {
        console.log('upd',upd);
        if(SID.toString() === upd.student.toString()){
            console.log('yes !');
            return {
                file : upd.file,
                student : upd.student,
                evaluated : true,
                score,
                remarks, 
            }
        }else{
            return upd;
        }
    })

    assignment.doneby = updateDoneBy;
    await assignment.save();

    console.log('operation done !');
    res.send('evaluated successfully');

}catch(err){
    console.log(err);
    return next({
        message : err.message,
        status : false
    });
}

});


router.get('/deletealldata' ,async(req, res, next) => {
    try{
        await db.Assignment.deleteMany({});
        await db.Classroom.deleteMany({});

        const sts = await db.Student.find({});
        const t = await db.Tutor.find({});


        crs.forEach( async(student) => {
            student.assignments = [];
            student.turnedAssignments = [];
            student.enrolledClasses = [];
            student.requestedClasses = [];
            await student.save();
        });

        
        t.forEach( async(student) => {
            student.classes = [];
            await student.save();
        });


        res.send('deleted')
    }catch(err){
        console.log(err);
        res.send(err);
    }
});


//===================== CURRENT LOGGED USER if any
router.get('/current' ,async(req, res, next) => {
    try{

        const token = req.cookies.token;
        if(token){
            const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if(verified){
                const user1 = await db.Student.findById(verified.userId)
                .populate({path : "requestedClasses", select : "-studentRequests"}).exec();
                if(user1)
                return res.send(user1);
                const user2 = await db.Tutor.findById(verified.userId)
                .populate({path : "classes"}).exec();
                // console.log('current Student',user1);
                // console.log('current tutpr',user2);
          
                return res.send(user2);
            }
            else{
                console.log('no logged in user found !');
                res.send(null);
            }
        }
        else{
            console.log('null');
            res.send(null);
        }
    }catch(error){
        console.log(error);
      res.send(null);
    }
});

router.post('/createNewUser' , async(req, res) =>{
    const {username, password} = req.body;
    const newUser = await db.User.create({
        username,
        password,
    });
    res.send(newUser);
});


//student's classrooms
router.get('/student/:userid/classrooms', authenticateUser ,async(req, res, next) => {
    try{
        
        const {userid} = req.params;
        console.log('request from =>',userid)
        const student = await db.Student.findById(userid)
        .populate({ path : "enrolledClasses", select : "-studentRequests"});

        console.log('student =>', student);
        if(!student){
            return next({
                message : 'could not find student !',
                status : false
            });
        }

        const allClassrooms = student.enrolledClasses.map( cls => {
            let turned = 0;
            student.turnedAssignments.forEach( assi => {
                if( cls.assignments.indexOf(assi) !== -1 )
                turned++;
            }); 
            return {
                _id : cls._id,
    creator : cls.creator, 
    description : cls.description,
    className : cls.className,
    subject : cls.subject,
    classroomID : cls.classroomID,
    studentRequests : cls.studentRequests,
    enrolledStudents : cls.enrolledStudents,
    assignments : cls.assignments,
    tests : cls.tests,
    comments :cls.comments,
    pending : cls.assignments.length - turned
            }
        });

        console.log(allClassrooms);
        res.send(allClassrooms);

    }catch(err){
        console.log(err);
        return next({
            message : err.message,
            status : false
        });
    }
});

//===========================classroom by ID => student
router.get('/student/:userid/classroom/:classroomid' ,async(req, res, next) => {
    try{

        console.log('userrequest for classroom info')
        const {userid, classroomid} = req.params;
        console.log(userid, classroomid);

        const classroom = await db.Classroom.findById(classroomid)
        .populate({path : "enrolledStudents assignments", select  : "-password -requestedClasses -turnedAssignments -enrolledClasses" }).exec();

        console.log(classroom);
        if(!classroom){
            return next({
                message : 'could not find class !',
                status : false
            });
        }

        const student = await db.Student.findById(userid);
        let upateAss = [];
        let turnedAsignments = 0;

        classroom.assignments.forEach( assi => {

            let ind = student.turnedAssignments.indexOf(assi._id);
            console.log(ind);

            if(ind !== -1){
                turnedAsignments++;
                //calculate student result if evaluated
                const studentsResult = assi.doneby.filter( doer => doer.student.toString() === userid.toString());
                
                const result = {
                    score : studentsResult[0].score,
                    remarks : studentsResult[0].remarks 
                }

                upateAss.push({
                    _id : assi._id,
                    createdAt : assi.createdAt,
                    description : assi.description,
                    subject : assi.subject,
                    topic : assi.topic,
                    file : assi.file,
                    turned : true,
                    evaluated : studentsResult[0].evaluated,
                    result : result
                });


            }else{

                upateAss.push({
                        _id : assi._id,
                        createdAt : assi.createdAt,
                        description : assi.description,
                        subject : assi.subject,
                        topic : assi.topic,
                        file : assi.file,
                        turned : false,
                        evaluated : false
                    });

                }
        });


        const dataToSend = {
            classInfo :{
                classroomID : classroom.classroomID,
                className : classroom.className,
                subject : classroom.subject,
                pending : upateAss.length - turnedAsignments,
                meeting : classroom.meeting
            },
            assignments : upateAss.reverse(),
            enrolledStudents : classroom.enrolledStudents
        }

console.log('sending ...',dataToSend);
        res.send(dataToSend);   

    }catch(err){
        console.log(err);
        return next({
            message : err.message,
            status : false
        });
    }
});


//=========================== Assignment by ID 
router.get('/assignment/:AID/get', async(req, res, next) => {
    try{
        const {AID} = req.params;
        console.log(AID);
 
        const assignment = await db.Assignment.findById(AID)
        .populate({path : "doneby", populate : { path : "student", select : "name email phone"}}).exec();


        if(!assignment){
            return next({
                message : 'could not find Assignment !',
                status : false
            });
        }
        console.log('daata from backend=>',assignment);
        res.send(assignment);  

    }catch(err){
        console.log(err);
        return next({
            message : err.message,
            status : false
        });
    }
});



//===========================Add a classroom meeting link
router.post('/:userid/schedulemeet/:cid' ,async(req, res, next) => {
    try{
        console.log('scheduling');
        const {cid, userid} = req.params;
        const {link, timing, ending} = req.body;

        let classroom = await db.Classroom.findById(cid);
        if(classroom.creator.toString() !== userid.toString()){
            console.log('You do not have access to this classroom');
            return next({
                message : 'You do not have access to this classroom'
            });
        }

        classroom.meeting = {link,timing,ending};
        await classroom.save();

        classroom = await db.Classroom.findById(cid);
        console.log(classroom.meeting);
        console.log('scheduled');
        res.send('meeting scheduled')

    }catch(err){
        console.log(err);
        return next({
            message : err.message
        });
    }
});

//===========================Add a classroom comment
router.post('/:userid/comment/:classroomid', authenticateUser ,async(req, res, next) => {
    try{
        let user;
        let classroom ;

        const {userid , classroomid} = req.params;
        const {comment, type} = req.body;      


if(type !== ''){       
    classroom = await db.Classroom.findById(classroomid);
    if(type === '1'){
            user = await db.Student.findById(userid);
            if(classroom.enrolledStudents.indexOf(userid) === -1)
            return next({
                message : "You're not allowed !"
            })
        }
        else {
            user = await db.Tutor.findById(userid);
                if(classroom.creator.toString() !== userid.toString())
                return next({
                    message : "You're not allowed !"
                })
            }  

       if(comment && comment.length > 0){

        if(!user || !classroom)
        return next({
            message : "something went wrong !"
        })

        const newComment = await db.Comment.create({
            by : type,
            comment : comment,
            byStudent : (type === '1') ? user : null, 
            byTutor : (type === '2') ? user : null,
        });
        console.log('this comment => ',newComment);
        classroom.comments.push(newComment._id);
        await classroom.save();
    }
}

        classroom = await db.Classroom.findById(classroomid)
        .populate({path : "comments", populate : {path : "byTutor byStudent", select : "-password"}});
        console.log('all classroom comments => ',classroom.comments);
        console.log(classroomid)
        res.send(classroom.comments.reverse());

    }catch(err){
        console.log(err);
        return next({
            message : err.message
        });
    }
});
//===========================classroom by ID => tutor
router.get('/classroom/:classroomid', async(req, res, next) => {
    try{
        const {classroomid} = req.params;
        console.log(classroomid);
 
        const classroom = await db.Classroom.findById(classroomid)
        .populate({path : "studentRequests enrolledStudents assignments", select : "-password", populate : {path : "doneby", populate : {path : "student"}}}).exec();
        if(!classroom){
            return next({
                message : 'could not find class !',
                status : false
            });
        }
        console.log(classroom);
        res.send(classroom);   

    }catch(err){
        console.log(err);
        return next({
            message : err.message,
            status : false
        });
    }
});

//===========================all classrooms of a tutor
router.get('/:tutorid/classrooms', async(req, res, next) => {
    try{
        const tutorid = req.params.tutorid;
 
        const tutor = await db.Tutor.findById(tutorid)
        .populate({path : "classes"}).exec();
        if(!tutor){
            return next({
                message : 'could not find tutor',
                status : false
            });
        }
        const classrooms = tutor.classes;
        res.send(classrooms);   

    }catch(err){
        console.log(err);
        return next({
            message : err.message,
            status : false
        });
    }
});


//=====================================create a new classroom
router.post('/:userid/classroom/new', authenticateUser,async(req, res, next) => {
    try{
console.log('in create classroom route');
       const userid = req.params.userid;
       const {className, subject, description} = req.body;

       const tutor = await db.Tutor.findById(userid);
       if(!tutor){
           return next({
               message : 'could not find tutor',
               status : false
           });
       }
       
       const generateUniqueId = require('generate-unique-id'); 
        let classroomID = generateUniqueId({
            length: 9,
            useLetters : false
           });

       const newClassroom = await db.Classroom.create({
           className, subject, creator : userid,classroomID, description
       })

       tutor.classes.push(newClassroom._id);
       await tutor.save();

       console.log(newClassroom);
       return next({
           message : 'classroom created successfully',
           status : true
       });      

    }catch(err){
        console.log(err);
       return next({
           message : err.message,
           status : false
       });
    }

});

//============================= send request to join a classroom
router.post('/:userid/joinclassroom/:CID', authenticateUser , async(req, res, next)=>{
    try{
        console.log('called');
        const {userid, CID}=  req.params;
        console.log(userid,CID);
        const student = await db.Student.findById(userid);
        console.log('sender=>',student.name);
        const classroom = await db.Classroom.findOne({classroomID : CID.toString()});

        if(!classroom)
        return next({
            message: `No classroom with found with id ${CID}`,
            status : false
    });

        if (student.requestedClasses.length > 0) {
            let isexist = student.requestedClasses.filter(request => request.toString() === classroom._id.toString());
            if (isexist.length > 0) {
                console.log('pending !');
                return next({
                            message: "Your   is still pending ",
                            status : false
                    });
            }
        }
        if (student.enrolledClasses.length > 0) {
            let isexist = student.enrolledClasses.filter(request => request.toString() === classroom._id.toString());
            if (isexist.length > 0) {
                console.log('already enrolled !');
                return next({
                            message: "you are already enrolled !",
                            status : false
                    });
            }
        }

        console.log('classroom=>',classroom);

        // const tutor = await db.Tutor.findById(classroom.creator);
        student.requestedClasses.push(classroom._id);
        classroom.studentRequests.push(userid);
        await student.save();
        await classroom.save();
        console.log('request sent successfully');
        return next({
            message : "request sent successfully !",
            status : true
        });

    }catch(err){
        console.log(err);
        return next({
            message : err.message,
            status : false
        });
    }

});


//===========================???????????????? authenticate the user =======classroom ACCEPT request  
router.post('/:classroomID/requests/:requestID/accept', async(req, res, next) => {
    try{
        console.log('working on classroom request acceptance');

        //requestID = student's ID who sent request
        const {classroomID, requestID} = req.params;
        const classRoom = await db.Classroom.findById(classroomID);        
        if(classRoom.enrolledStudents.length > 0){
        const alreadyAccepted = classRoom.enrolledStudents.filter( joinedID => joinedID.toString() === requestID.toString());
        if(alreadyAccepted.length > 0){
            return next({
                message : 'student already in classroom !'
            });
        }
    }
        const student = await db.Student.findById(requestID);
        //remove request and add to joined student then add to students myClassrooms
        const updatedRequests = classRoom.studentRequests.filter(id => id.toString() !== requestID.toString());
        classRoom.studentRequests = updatedRequests; 
        classRoom.enrolledStudents.push(requestID);
        student.enrolledClasses.push(classroomID);
        await classRoom.save();
        //remove from student's myClassroomRequests
        const updatedClassroomsRequest = student.requestedClasses.filter( req => req.toString() !== classroomID.toString());
        student.requestedClasses = updatedClassroomsRequest;
        await student.save();

        console.log('classroom',classRoom);
        return next({
            message : "request accepted"
        });

    }catch(error){
        console.log(`catch error : ${error}`);
        return next({
            message : 'couldn\'t process request....please try after sometime'
        });
    }
});

//classroom REJECT request  ?????????????? authenticate the user
router.post('/:classroomID/requests/:requestID/reject', async(req, res, next) => {

    try{
        //requestID = student's ID who sent request
        const {classroomID, requestID} = req.params;
        const classRoom = await db.Classroom.findById(classroomID);        
        if(classRoom.enrolledStudents.length > 0){
        const requestExists = classRoom.enrolledStudents.filter( joinedID => joinedID.student.toString() === requestID.toString());
        if(requestExists.length === 0){
            return next({
                message : 'Request already rejected !'
            });
        }
    }

        const student = await db.Student.findById(requestID);
        //remove request from classroom, and student's requested classes
        const updatedRequests = classRoom.studentRequests.filter(id => id.toString() !== requestID.toString());
        classRoom.studentRequests = updatedRequests; 
        await classRoom.save();

        //remove from student's myClassroomRequests
        const updatedClassroomsRequest = student.requestedClasses.filter( req => req.toString() !== classroomID.toString());
        student.requestedClasses = updatedClassroomsRequest;
        await student.save();

        console.log('classroom',classRoom);
        return next({
            message : "request Rejected Successfully"
        });
    }catch(error){
        console.log(`catch error : ${error}`);
        return next({
            message : 'couldn\'t process request....please try after sometime'
        });
    }
});



//====================LOGIN=============
router.post('/login', async(req, res, next) => {
    try{
        const {as, email, password } = req.body;
        if(as === "student"){
            const user = await db.Student.findOne({email});
           if(user){
               console.log(user);
               const correctPassword = await bcrypt.compare(password, user.password);
               if(correctPassword){
                   console.log(bcrypt.compare(password, user.password));
                //jwt work
                const token = jwt.sign({
                    userId : user._id,
                 },
                 process.env.JWT_SECRET_KEY 
                 );
                 //send the token to browser cookie
                 console.log('logged in as '+user.name);
                 res.cookie( "token", token, {httpOnly : true}).send({
                    message : `logged in as ${user.name}`,
                    status : true
                });
}
               else return next({message : 'wrong password', status : false});
}
           else return next({message : 'wrong email', status : false});
        }else{
            const user = await db.Tutor.findOne({email});
            if(user){
                console.log(user);
                if(bcrypt.compare(password, user.password)){
                 //jwt work
                 const token = jwt.sign({
                     userId : user._id,
                  },
                  process.env.JWT_SECRET_KEY 
                  );
                  //send the token to browser cookie
                  console.log('logged in as '+user.name);
                  res.cookie( "token", token, {httpOnly : true}).send({
                      message : `logged in as ${user.name}`,
                      status : true
                  });
                }
                else return next({message : 'wrong password', status : false});
            }
            else return next({message : 'wrong email', status : false});            
        }    
    }
    catch(error){
        console.log('login error',error);
    }

});


//=====================SIGNUP===============
router.post('/signup', async(req, res, next) => {
    console.log('called');
    try{
        const {as, name, gender, email, phone, dob, password } = req.body;
        console.log('Body',req.body);

        if(as === "student"){
            const user1 = await db.Student.find({email});
            const user2 = await db.Student.find({phone});
            if(user1.length>0){
            return next({
                message : "email already regstered",
                status : false
            });
        }
        if(user2.length > 0 ){
            return next({
                message : "phone already regstered",
                status : false
            });
        }

        }
         else {

            const user1 = await db.Tutor.find({email});
            const user2 = await db.Tutor.find({phone});
            if(user1.length>0){
            return next({
                message : "email already regstered",
                status : false
            });
        }
        if(user2.length>0){
            return next({
                message : "phone already regstered",
                status : false
            });
        }

         }

         const userData = {
             ...req.body,
             role : as,
             password :  await bcrypt.hash(password, 10)
         }

         if(as === "student"){
             const newStudent = await db.Student.create(userData);
             console.log('newStudent',newStudent);
         }
         else {
            const newTutor = await db.Tutor.create(userData);
            console.log('newTutor',newTutor);
         }

        return next({
            message : "Registered successfully",
            status : true
        });
        
    }catch(error){
        console.log(error);
        return next({
            message : error.message,
            status  : false
        });
    }   
});


module.exports = router;