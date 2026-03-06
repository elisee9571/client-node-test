const express = require("express");
const router = express.Router();

const postsController = require("../controllers/posts.controller");
const authService = require("../middlewares/auth.service");

router.get("/", postsController.posts);
router.get("/new", authService.checkAuth, postsController.newPostForm);
router.get("/:id", postsController.post);
router.get("/:id/edit", authService.checkAuth, postsController.editPostForm);

router.post("/new", authService.checkAuth, postsController.newPost);
router.post("/:id/edit", authService.checkAuth, postsController.editPost);

module.exports = router;
