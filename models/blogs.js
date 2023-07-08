const mongoose = require("mongoose");
const blogSchema = mongoose.Schema({
    title:{type:String,required:true,unique:true},
    summary:{type:String,required:true,unique:false},
    imgurl:{type:String,required:true,unique:false},
    desc:{type:String,required:true,unique:false},
    user:{type:String,require:true,unique:false}
})

const model = mongoose.model("blogs",blogSchema);
module.exports = model;