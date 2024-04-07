const controller = require("./controller");
const {
  authenticateUser,
  checkTokenExpiry,
} = require("../../utils/middleWares");

const router = require("express").Router();
router.post(
  "/:userid/schedulemeet/:cid",
  checkTokenExpiry,
  authenticateUser,
  controller.addMeetLink
);

router.post(
  "/:userid/comment/:classroomid",
  checkTokenExpiry,
  authenticateUser,
  controller.addClassComment
);
router.get("/classroom/:classroomid", controller.classById); // tutor
router.get("/:tutorid/classrooms", controller.classesByTutor);
router.post(
  "/:userid/classroom/new",
  checkTokenExpiry,
  authenticateUser,
  controller.createNewClass
);

router.post(
  "/:userid/joinclassroom/:CID",
  checkTokenExpiry,
  authenticateUser,
  controller.sendRequest
);

// ACCEPT / REJECT requests from student
router.post(
  "/:classroomID/handlerequest/:requestID/:action", // type : accept/reject
  controller.handleClassRequest
);
router.get(
  "/student/:userid/classrooms",
  checkTokenExpiry,

  authenticateUser,
  controller.enrolledClasses
);
router.get(
  "/student/:userid/classroom/:classroomid",
  controller.getClassroomById
); // student

module.exports = router;
