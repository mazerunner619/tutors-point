const db = require("../../Models");
const classroom = {};
const { createError } = require("../../utils/utilFunctions");

//===========================Add a classroom meeting link
classroom.addMeetLink = async (req, res, next) => {
  try {
    //console.log('scheduling');
    const { cid, userid } = req.params;
    const { link, timing, ending } = req.body;

    let classroom = await db.Classroom.findById(cid);
    if (classroom.creator.toString() !== userid.toString()) {
      return next(createError("You do not have access to this classroom", 401));
    }
    classroom.meeting = { link, timing, ending };
    await classroom.save();

    res.send({ data: { link, timing, ending }, message: "OK" });
  } catch (error) {
    return next(createError(error.message, error.statusCode));
  }
};

//===========================Add a classroom comment
classroom.addClassComment = async (req, res, next) => {
  try {
    let user;
    let classroom;
    let newComment;

    const { userid, classroomid } = req.params;
    const { comment, type } = req.body;

    if (type !== "") {
      classroom = await db.Classroom.findById(classroomid);
      if (type === "1") {
        user = await db.Student.findById(userid);
        if (classroom.enrolledStudents.indexOf(userid) === -1)
          return next(
            createError("unauthorized student, not in this class", 401)
          );
      } else {
        user = await db.Tutor.findById(userid);
        if (classroom.creator.toString() !== userid.toString())
          return next(createError("unauthorized tutor, not your class", 401));
      }

      if (comment && comment.length > 0) {
        if (!user || !classroom)
          return next(createError("something went wrong", 400));

        newComment = await db.Comment.create({
          by: type,
          comment: comment,
          byStudent: type === "1" ? user : null,
          byTutor: type === "2" ? user : null,
        });
        //console.log('this comment => ',newComment);
        classroom.comments.push(newComment._id);
        await classroom.save();
      }
    }
    res.send({ data: newComment, message: "OK" });
  } catch (err) {
    return next(createError(err.message, err.statusCode));
  }
};

//===========================classroom by ID => tutor
classroom.classById = async (req, res, next) => {
  try {
    const { classroomid } = req.params;
    const classroom = await db.Classroom.findById(classroomid).populate({
      path: "studentRequests enrolledStudents comments",
      select: "-password -enrolledClasses -turnedAssignments -requestedClasses",
      populate: {
        path: "byStudent byTutor",
        select: "_id name",
      },
    });
    if (!classroom) {
      return next(createError("class not found !", 404));
    }
    const assignments = await db.Assignment.find({
      classRoom: classroomid,
    }).populate({
      path: "doneby",
      populate: {
        path: "student",
        select: "name phone email evaluated score remarks",
      },
    });

    classroom.assignments = assignments;
    res.setHeader("Content-Type", "application/json");
    res.send({ data: classroom, message: "OK" });
  } catch (err) {
    return next(createError(err.message, err.statusCode));
  }
};

//===========================classroom by ID => student
classroom.getClassroomById = async (req, res, next) => {
  try {
    const { userid, classroomid } = req.params;
    const classroom = await db.Classroom.findById(classroomid)
      .populate({
        path: "enrolledStudents assignments comments",
        select:
          "-password -requestedClasses -turnedAssignments -enrolledClasses",
        populate: { path: "byTutor byStudent", select: "name" },
      })
      .exec();
    if (!classroom) {
      return next(createError("class not found !", 404));
    }

    const student = await db.Student.findById(userid);
    let upateAss = [];
    let turnedAsignments = 0;

    classroom.assignments.forEach((assi) => {
      let ind = student.turnedAssignments.indexOf(assi._id);
      //console.log(ind);
      if (ind !== -1) {
        turnedAsignments++;
        //calculate student result if evaluated
        const studentsResult = assi.doneby.filter(
          (doer) => doer.student.toString() === userid.toString()
        );

        const result = {
          score: studentsResult[0].score,
          remarks: studentsResult[0].remarks,
        };

        upateAss.push({
          _id: assi._id,
          createdAt: assi.createdAt,
          description: assi.description,
          subject: assi.subject,
          topic: assi.topic,
          file: assi.file,
          turned: true,
          evaluated: studentsResult[0].evaluated,
          result: result,
        });
      } else {
        upateAss.push({
          _id: assi._id,
          createdAt: assi.createdAt,
          description: assi.description,
          subject: assi.subject,
          topic: assi.topic,
          file: assi.file,
          turned: false,
          evaluated: false,
        });
      }
    });

    const dataToSend = {
      // classInfo: {
      classroomID: classroom.classroomID,
      className: classroom.className,
      subject: classroom.subject,
      pending: upateAss.length - turnedAsignments,
      meeting: classroom.meeting,
      comments: classroom.comments,
      // },
      assignments: upateAss.reverse(),
      enrolledStudents: classroom.enrolledStudents,
    };
    res.send({ data: dataToSend, message: "OK" });
  } catch (err) {
    return next(createError(err.message, err.statusCode));
  }
};

//=========================== all classrooms of a tutor
classroom.classesByTutor = async (req, res, next) => {
  try {
    const tutorid = req.params.tutorid;

    const tutor = await db.Tutor.findById(tutorid)
      .populate({ path: "classes" })
      .exec();
    if (!tutor) {
      return next(createError("tutor not found", 404));
    }
    const classrooms = tutor.classes;
    res.send({ data: classrooms, message: "OK" });
  } catch (err) {
    return next(createError(err.message, err.statusCode));
  }
};

//===================================== create a new classroom
classroom.createNewClass = async (req, res, next) => {
  try {
    //console.log('in create classroom route');
    const userid = req.params.userid;
    const { className, subject, description } = req.body;

    const tutor = await db.Tutor.findById(userid);
    if (!tutor) {
      return next(createError("tutor not found", 404));
    }

    const generateUniqueId = require("generate-unique-id");
    let classroomID = generateUniqueId({
      length: 9,
      useLetters: false,
    });

    const newClassroom = await db.Classroom.create({
      className,
      subject,
      creator: userid,
      classroomID,
      description,
    });
    tutor.classes.push(newClassroom._id);
    await tutor.save();
    res.send({ data: newClassroom, message: "OK" });
  } catch (err) {
    return next(createError(err.message, err.statusCode));
  }
};

//============================= send request to join a classroom
classroom.sendRequest = async (req, res, next) => {
  try {
    const { userid, CID } = req.params;
    const student = await db.Student.findById(userid);
    const classRoom = await db.Classroom.findOne({
      classroomID: CID.toString(),
    });

    if (student.requestedClasses.length > 0) {
      let isexist = student.requestedClasses.filter(
        (request) => request.toString() === classRoom._id.toString()
      );
      if (isexist.length > 0) {
        return next(createError("request pending", 404));
      }
    }
    if (student.enrolledClasses.length > 0) {
      let isexist = student.enrolledClasses.filter(
        (request) => request.toString() === classRoom._id.toString()
      );
      if (isexist.length > 0) {
        return next(createError("already enrolled", 404));
      }
    }
    student.requestedClasses.push(classRoom._id);
    classRoom.studentRequests.push(userid);
    await student.save();
    await classRoom.save();
    console.log("request sent");
    res.send({ data: classRoom, message: "OK" });
  } catch (err) {
    console.log("this error", err);
    return next(createError(err.message, err.statusCode));
  }
};

classroom.handleClassRequest = async (req, res, next) => {
  try {
    console.log("handling request");
    // return next(createError("he error", 404));
    const { classroomID, requestID, action } = req.params;
    let classRoom = await db.Classroom.findById(classroomID);
    const student = await db.Student.findById(requestID);
    //remove request and add to joined student then add to students myClassrooms
    const updatedRequests = classRoom.studentRequests.filter(
      (id) => id.toString() !== requestID.toString()
    );
    classRoom.studentRequests = updatedRequests;
    if (action === "accept") {
      console.log("accept request");
      classRoom.enrolledStudents.push(requestID); // only accept
      student.enrolledClasses.push(classroomID); // only accept
    } else {
      console.log("reject request");
    }
    await classRoom.save();
    //remove from student's myClassroomRequests
    const updatedClassroomRequestsOfStudent = student.requestedClasses.filter(
      (req) => req.toString() !== classroomID.toString()
    );
    student.requestedClasses = updatedClassroomRequestsOfStudent;
    await student.save();

    classRoom = await db.Classroom.findById(classroomID, {
      studentRequests: 1,
      enrolledStudents: 1,
    }).populate({
      path: "studentRequests enrolledStudents",
      select: "-password -enrolledClasses -turnedAssignments -requestedClasses",
    });
    console.log("handling request success");
    res.send({
      data: {
        studentRequests: classRoom.studentRequests,
        enrolledStudents: classRoom.enrolledStudents,
      },
      message: "OK",
    });
    // res.send({ data: "request accepted", message: "OK" });
  } catch (error) {
    console.log(error);
    return next(createError("couldn't process request", error.statusCode));
  }
};

// classrooms enrolled by students
classroom.enrolledClasses = async (req, res, next) => {
  try {
    const { userid } = req.params;
    //console.log('request from =>',userid)
    const student = await db.Student.findById(userid).populate({
      path: "enrolledClasses",
      select: "-studentRequests",
    });

    //console.log('student =>', student);
    if (!student) {
      return next(createError("student not found!", 404));
    }

    const allClassrooms = student.enrolledClasses.map((cls) => {
      let turned = 0;
      student.turnedAssignments.forEach((assi) => {
        if (cls.assignments.indexOf(assi) !== -1) turned++;
      });
      return {
        _id: cls._id,
        creator: cls.creator,
        description: cls.description,
        className: cls.className,
        subject: cls.subject,
        classroomID: cls.classroomID,
        studentRequests: cls.studentRequests,
        enrolledStudents: cls.enrolledStudents,
        assignments: cls.assignments,
        tests: cls.tests,
        comments: cls.comments,
        pending: cls.assignments.length - turned,
      };
    });

    //console.log(allClassrooms);
    res.send({ data: allClassrooms, message: "OK" });
  } catch (error) {
    return next(createError(error.message, error.statusCode));
  }
};

module.exports = classroom;
