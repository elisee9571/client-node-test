const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller");
const authService = require("../middlewares/auth.service");

router.get("/profile", authService.checkAuth, usersController.showProfile);

module.exports = router;
