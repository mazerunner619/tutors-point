const db = require("../../Models");
const { upload_get_url, destroyFile } = require("../../utils/cloudinaryHelper");
const { createError } = require("../../utils/utilFunctions");
const assignment = {};

//===================== upload neww assignment to class  ????? authenticate tutor

assignment.getAllAssignments = async (req, res, next) => {
  try {
    const { classroomid } = req.body;
  } catch (error) {
    return next(createError(err.message, err.statusCode));
  }
};
assignment.addNewAssignment = async (req, res, next) => {
  //console.log("*** here ***")
  try {
    const { topic, subject, description } = req.body;
    const { classroomID } = req.params;
    const classroom = await db.Classroom.findById(classroomID);
    if (!classroom) return next(createError("classroom not found  !", 404));
    const assignmentFile = {
      fileID: null,
      fileURL: null,
    };
    const FILE = req.file;
    if (FILE === undefined) console.log("no file uploaded as pdf");
    else {
      const { public_id, secure_url } = await upload_get_url(FILE.path);
      assignmentFile.fileID = public_id;
      assignmentFile.fileURL = secure_url;
    }
    const newAss = await db.Assignment.create({
      topic,
      subject,
      description,
      file: assignmentFile,
      classRoom: classroomID,
      creator: classroom.creator,
    });

    classroom.assignments.push(newAss._id);
    await classroom.save();

    res.send({
      message: "OK",
      data: newAss,
    });
  } catch (err) {
    return next(createError(err.message, err.statusCode));
  }
};

//====================submit assignment by student ??? authenticate student
assignment.submitAssignment = async (req, res, next) => {
  try {
    console.log("submitting asn");
    const { AID, userid } = req.params;
    const FILE = req.file;
    const student = await db.Student.findById(userid);
    const assignment = await db.Assignment.findById(AID);
    if (!assignment || !student)
      return next(createError("Something went wrong !", 500));

    if (student.turnedAssignments.indexOf(AID) !== -1) {
      return next(createError("already submitted!", 404));
    }

    const { public_id, secure_url } = await upload_get_url(FILE.path);
    const file = {
      fileID: public_id,
      fileURL: secure_url,
    };
    assignment.doneby.push({
      student: userid,
      file,
    });

    await assignment.save();
    student.turnedAssignments.push(AID);
    await student.save();
    console.log("submitted");
    res.send({ data: "", message: "turned in successfully !" });
  } catch (err) {
    return next(createError(err.message, err.statusCode));
  }
};

//=========================evaluate assignment => tutor ???authenticateUser
assignment.evaluateAssignment = async (req, res, next) => {
  try {
    console.log("operation started !");

    const { score, remarks } = req.body;
    const { userid, SID, AID } = req.params;

    let student = await db.Student.findById(SID);
    let assignment = await db.Assignment.findById(AID);

    if (assignment.creator.toString() !== userid.toString()) {
      console.log("fails here", userid, AID, SID);
      return next(createError("Unauthorized !", 401));
    }

    if (!student || !assignment)
      return next(createError("Something went wrong !", 500));

    const updateDoneBy = assignment.doneby.map((upd) => {
      ////console.log('upd',upd);
      if (SID.toString() === upd.student.toString()) {
        ////console.log('yes !');
        return {
          file: upd.file,
          student: upd.student,
          evaluated: true,
          score,
          remarks,
        };
      } else {
        return upd;
      }
    });

    assignment.doneby = updateDoneBy;
    await assignment.save();

    ////console.log('operation done !');
    res.send({ data: { score, remarks }, message: "OK" });
  } catch (err) {
    return next(createError(err.message, err.statusCode));
  }
};

//=========================== Assignment by ID
assignment.getById = async (req, res, next) => {
  try {
    const { AID } = req.params;
    ////console.log(AID);

    const assignment = await db.Assignment.findById(AID)
      .populate({
        path: "doneby",
        populate: { path: "student", select: "name email phone" },
      })
      .exec();

    if (!assignment) {
      return next(createError("Assignment not found !", 404));
    }
    ////console.log('daata from backend=>',assignment);
    res.send(assignment);
  } catch (err) {
    return next(createError(err.message, err.statusCode));
  }
};

assignment.refreshAss = async (req, res, next) => {
  try {
    const { userid, classroomid } = req.params;
    ////console.log('refreshing.....', userid, classroomid);
    const classroom = await db.Classroom.findById(classroomid)
      .populate({ path: "enrolledStudents assignments" })
      .exec();
    const student = await db.Student.findById(userid);
    ////console.log(classroom, student);
    if (!classroom || !student) {
      return next(createError("class not found !", 404));
    }

    let upateAss = [];
    let turnedAsignments = 0;

    classroom.assignments.forEach((assi) => {
      let ind = student.turnedAssignments.indexOf(assi._id);
      ////console.log(ind);

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
          description: assi.description,
          subject: assi.subject,
          topic: assi.topic,
          file: assi.file,
          turned: false,
          evaluated: false,
        });
      }
    });

    res.send({ data: upateAss.reverse(), message: "OK" });
  } catch (err) {
    return next(createError(err.message, err.statusCode));
  }
};

assignment.deleteAllAsn = async (req, res) => {
  // await db.Comment.deleteMany({});
  await db.Assignment.deleteMany({});
  await db.Classroom.updateMany({}, { $set: { assignments: [] } });
  await db.Student.updateMany({}, { $set: { turnedAssignments: [] } });
  res.send("<b>deleted all assignments</b>");
};
module.exports = assignment;
