const mongoose = require ("mongoose");
const usersSchema = mongoose.Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true,unique:false},
    blogs:[]
});

const model = mongoose.model("users",usersSchema);
module.exports = model;