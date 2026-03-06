const express = require("express");
const router = express.Router();

const commentsController = require("../controllers/comments.controller");
const authService = require("../middlewares/auth.service");

router.post("/posts/:postId", authService.checkAuth, commentsController.createComment);

module.exports = router;
