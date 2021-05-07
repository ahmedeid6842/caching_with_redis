const express = require("express");
const mongoose = require("mongoose");
const { initDB } = require("./utils/redis")
const blog = require("./routes/blogs");

require("./utils/cache");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/',blog)

const PORT = process.env.PORT || 3000

mongoose
    .connect("mongodb://localhost/vidly")
    .then(() => {
        app.listen(PORT, console.log(`connected successfully ... port : ${PORT}`))
    })
    .catch((err) => console.log(err.message));
