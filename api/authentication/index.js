const controller = require("./controller");
const router = require("express").Router();

router.post("/login", controller.login);
router.post("/signup", controller.signup);
router.post("/logout", controller.logout);
router.get("/current", controller.currentLoggedInUser);

module.exports = router;
