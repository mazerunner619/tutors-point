const controller = require("./controller");
const router = require("express").Router();
const { checkTokenExpiry } = require("../../utils/middleWares");

router.post("/login", controller.login);
router.post("/signup", controller.signup);
router.post("/logout", controller.logout);
router.get("/current", controller.currentLoggedInUser);

module.exports = router;
