const express = require("express");
const router = express.Router();

const blogsControllers = require("../controllers/blogs");
const cleanCache = require("../middleware/cleancache")

router.post("/blogs", cleanCache,blogsControllers.postBlogs);
router.get("/blogs/:id", blogsControllers.getBlogs);

module.exports=router;