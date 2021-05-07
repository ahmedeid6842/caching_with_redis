const mongoose = require("mongoose");

const blogsSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    title: {
        type: String
    },
    content: {
        type: String
    }
})

module.exports = mongoose.model("Blog", blogsSchema);