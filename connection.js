require("dotenv").config()

const mongoose = require("mongoose");
try {
    mongoose.connect("mongodb://0.0.0.0:27017/blog-website")
    console.log("connection establish from database...");
    
} catch (error) {
    console.log("error while connecting from database !!!")
}