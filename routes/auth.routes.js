const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.get("/register", authController.showRegister);
router.get("/login", authController.showLogin);

router.post("/register", authController.signUp);
router.post("/login", authController.signIn);

router.get("/logout", authController.logout);

module.exports = router;
