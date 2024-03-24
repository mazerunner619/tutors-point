const router = require("express").Router();
const controller = require("./controller");
const { authenticateUser } = require("../../utils/middleWares");
const { upload } = require("../../utils/cloudinaryHelper");

router.post(
  "/classroom/:classroomID/new/assignment/:userid",
  authenticateUser,
  upload.single("assignment"),
  controller.addNewAssignment
);
router.post(
  "/:userid/assignment/:AID/submit",
  authenticateUser,
  upload.single("assignment"),
  controller.submitAssignment
);
router.post(
  "/:userid/assignment/:AID/evaluate/:SID",
  authenticateUser,
  controller.evaluateAssignment
);
router.get("/assignment/:AID/get", controller.getById);
router.get(
  "/student/:userid/refreshassignments/:classroomid",
  controller.refreshAss
);
router.get("/delete/all/asn", controller.deleteAllAsn);

module.exports = router;
