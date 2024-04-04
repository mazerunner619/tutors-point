const controller = require("./controller");
const { authenticateUser } = require("../../utils/middleWares");

const router = require("express").Router();
router.post(
  "/:userid/schedulemeet/:cid",
  authenticateUser,
  controller.addMeetLink
);

router.post(
  "/:userid/comment/:classroomid",
  authenticateUser,
  controller.addClassComment
);
router.get("/classroom/:classroomid", controller.classById); // tutor
router.get("/:tutorid/classrooms", controller.classesByTutor);
router.post(
  "/:userid/classroom/new",
  authenticateUser,
  controller.createNewClass
);

router.post(
  "/:userid/joinclassroom/:CID",
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
  authenticateUser,
  controller.enrolledClasses
);
router.get(
  "/student/:userid/classroom/:classroomid",
  controller.getClassroomById
); // student

module.exports = router;
