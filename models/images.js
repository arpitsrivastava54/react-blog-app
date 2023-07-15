const mongoose = require ("mongoose");

const imageSchema = mongoose.Schema({
    url:String,
})

const imgModel = mongoose.model("images",imageSchema)
module.exports = imgModel;