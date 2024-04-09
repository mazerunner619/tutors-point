const controller = require("./controller");
const router = require("express").Router();

const {
  checkCorrectOtpUser,
  checkTokenExpiry,
  authenticateUser,
} = require("../../utils/middleWares");

router.post("/login", controller.login);
router.post("/send-signup-otp", controller.sendSignupOtp);
router.post(
  "/verify-signup-otp",
  checkCorrectOtpUser,
  controller.verifySignupOtp
);
router.post("/password/reset/link", controller.sendPasswordResetLink);
router.post("/password/reset/verify", controller.resetPassword);
router.post("/logout", controller.logout);
router.get("/current", controller.currentLoggedInUser);
router.post(
  "/profile/save/:userid/:role",
  checkTokenExpiry,
  authenticateUser,
  controller.saveProfileChanges
);

module.exports = router;
