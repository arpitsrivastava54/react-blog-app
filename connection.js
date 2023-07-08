require("dotenv").config()

const mongoose = require("mongoose");
try {
    mongoose.connect(process.env.DATABASE_URL)
    console.log("connection establish from database...");
    
} catch (error) {
    console.log("error while connecting from database !!!")
}