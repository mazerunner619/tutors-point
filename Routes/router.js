const express = require('express');
const router = express.Router();
// const Quote = require('../Models/quoteModel');
const Student = require('../Models/studentModel');
const Tutor = require('../Models/tutorModel');
const AuthMW = require('../auth-middleware');
const { db } = require('../Models/Classroom');




router.post('/exists', async (req, res) => {
    
    console.log('in exists route : '+req.body);
    const {_id} = req.body;
    console.log('checking ! id : '+_id);
    const s = await Student.findById(_id);
    if(s){
    console.log('found student : '+s);
        return res.send('/dashs');
    }
    const t = await Tutor.findById(_id);
    if(t) {
        console.log('found tutor : '+t);
        return res.send('/dasht');
    }
    return res.send('new');
});

router.get('/clearS', async (req, res) => {
   await Student.deleteMany({});
   res.send('deleted all students');
});

router.get('/clearT', async (req, res) => {
    await Tutor.deleteMany({});
    res.send('deleted all tutors');
});


router.get('/getstudents',AuthMW, async (req, res) => {
    const students = await Student.find({});
    res.send(students);
});

router.get('/gettutors', async (req, res) => {
    const tutors = await Tutor.find({});
    res.send(tutors);
});

router.post('/addStudentRequest', AuthMW, (req, res) => {

   const { student, tutor} = req.body;

    //added to tutors received req list
     Tutor.findOneAndUpdate(
        { _id:tutor._id}, 
        { $push: { studentRequests: student } },
       function (error, success) {
             if (error) {
                 console.log(error);
             } else {
                 console.log('recieved student request');
             }
         }
         );

         //added to student sent req list
          Student.findOneAndUpdate(
            { _id:student._id}, 
            { $push: { reqTutors: tutor} },
           function (error, success) {
                 if (error) {
                     console.log(error);
                 } else {
                     console.log('request sent to tutor');
                 }
             }
             );
             res.send('done');
});

router.post('/acceptRequest',AuthMW,  (req, res) => {

    const { student, tutor} = req.body;
 
     //add to student's myTutors
   Student.findOneAndUpdate(
         { _id: student._id}, 
         { $push: { myTutors: tutor._id } },
        function (error, success) {
              if (error) {
                  console.log(error);
              } else {
                  console.log('student tutor added');
              }
          }
          );
 
          //add to tutor's student list
           Tutor.findOneAndUpdate(
             { _id : tutor._id}, 
             { $push: { myStudents: student} },
            function (error, success) {
                  if (error) {
                      console.log(error);
                  } else {
                    console.log('request accepted by tutor');
                  }
              }
              );


        //remove from tutors received req list
         Tutor.findByIdAndUpdate(
            tutor._id, 
            { $pull: { studentRequests : { _id: student._id } } }, { safe: true, upsert: true },
            function(err) {
                if (err) {
                    console.log(err);
                }
                 else{
                    console.log('done');
                 }
            }); 

    //remove from student's requested tutors
     Student.findByIdAndUpdate(
                student._id, 
                { $pull: { reqTutors : { _id: tutor._id } } }, { safe: true, upsert: true },
                function(err) {
                    if (err) {
                        console.log(err);
                     }
                     else{
                        console.log('done');
                     }
                }); 
        
            res.send('done');
 });

//create a new classroom
 router.post('/:tutorid/classroom/new', async(req, res, next) => {
     try{
console.log('in create classroom route');
        const tutorid = req.params.tutorid;
        const {className, subject} = req.body;

        const tutor = await db.Tutor.findById(tutorid);
        if(!tutor){
            return next({
                message : 'could not find tutor',
                status : false
            });
        }

        const newClassroom = await db.Classroom.create({
            className, subject, creator : tutorid
        })

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


 router.post('/deleteRequest', AuthMW, async (req, res) => {

    const { student, tutor} = req.body;

    //remove from student's requested tutors
   await Student.findByIdAndUpdate(
        student._id, 
        { $pull: { reqTutors : { _id: tutor._id } } }, { safe: true, upsert: true },
        function(err) {
            if (err) {
                console.log(err);
             }
             else{
                console.log('done');
             }
        }); 

        //remove from tutor's request list
        await Tutor.findByIdAndUpdate(
            tutor._id, 
            { $pull: { studentRequests : { _id: student._id } } }, { safe: true, upsert: true },
            function(err) {
                if (err) {
                    console.log(err);
                }
                 else{
                    console.log('done');
                 }
            }); 
            res.send('done');

    });


router.post('/student' ,AuthMW, (req, res) => {

console.log('registering a student');
    const {_id, fName, lName, ffName, flName, address, city, pincode, gender, email, dob } = req.body;
    const name = fName+' '+lName;
    const fatherName = ffName+' '+flName;

    const newStudent = new Student(
        {
            _id,
            name,
            fatherName,
            gender,
            dob,
            email,
            address,
            city,
            pincode
        });
    newStudent.save();
    console.log('added new student '+newStudent);
    res.send(_id);
});

router.post('/tutor' , AuthMW ,(req, res) => {
    console.log(req.body);
    const {_id, fName, lName, ffName, flName, address, city, pincode, gender, email, dob } = req.body;
    const name = fName+' '+lName;
    const fatherName = ffName+' '+flName;

    const newTutor = new Tutor(
        {
            _id,
            name,
            fatherName,
            gender,
            dob,
            email,
            address,
            city,
            pincode
        });
    newTutor.save();
    console.log('added new Tutor : '+newTutor);
    res.send(_id);
});

router.post('/tutordetails/:id' , AuthMW,  async(req, res) => {
    await Tutor.updateOne({_id : req.params.id}, req.body);
    console.log('updated tutor\'s : '+ req.body);
    res.send('registered successufully');
});


router.post('/studentdetails/:id' , AuthMW, async (req, res) => {

    await Student.updateOne({_id : req.params.id},req.body);
    console.log('updated student\'s : '+ req.body);
    res.send('registered successufully');
});

router.get('/logout' ,AuthMW,  (req, res) => {
    res.cookie("token", "",{
    httpOnly : true,
    expires : new Date(0)
    }).send();
})

module.exports = router;