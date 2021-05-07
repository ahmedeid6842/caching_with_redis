const util = require("util");

const Blogs = require("../models/blogs");
const { getDB } = require("../utils/redis");


module.exports.postBlogs = async (req, res) => {
    console.log("i'm here test me")
    const { title, userId, content } = req.body;
    const blogs = new Blogs({
        title,
        userId,
        content
    })
    await blogs.save()
    res.send(blogs);
}

module.exports.getBlogs = async (req, res) => {
    const blogs = await Blogs.find({ userId: req.params.id })
        .cache(option = { key: req.params.id }); //sepcify we will using caching

    res.send(blogs);
}


