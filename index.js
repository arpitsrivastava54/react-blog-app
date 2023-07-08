const express = require("express");
const app = express();
require("./connection");
const cors = require ("cors");
const User = require("./models/users.js");
const Blog = require ("./models/blogs.js");

app.use(cors());
app.use(express.json());

app.get("", async(req, res) => {
    res.json({message:"okk"});
});

// --------------- user-api -------------------------


// --------------- for registration -------------------------

app.post("/user/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await new User({ username: username, password: password });
    user = await user.save();
    res.status(200).json({ message: "registration successfull.." , user:user});
  } catch (error) {
    console.log("error");
    res.status(404).json("registration failed..");
  }
});
// --------------- for user updation -------------------------

app.put("/user/update/:id",async(req,res)=>{
    const userid = req.params.id;
    try {
        let user = await User.findByIdAndUpdate({_id:userid},{$set:req.body});
        res.status(200).json({message:"data update successfully..",user:user});
    } catch (error) {
        res.status(500).json({message:"data updation failed..",error:error});
    }
});


app.post("/user/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username:username, password:password });
    if(user){
        res.status(200).json({message:"user found",user:user});
    }else{
      res.status(404).json({message:"user not found"})
    }
  } catch (error) {
    res.status(404).json({message:"unnable to fetch from backend server..."})
  }
});

// --------------- blog-api -------------------------

app.get("/user/blog/:user",async(req,res)=>{
  const user = req.params.user;
  const blogs = await Blog.find({user:user});
  res.json({blogs:blogs});
})



app.post("/blog/new/:id",async (req,res)=>{
    const userid = req.params.id;
    let user = await User.findOne({_id:userid});
    const {title,summary,imgurl,desc} = req.body;
    try {
        let blog =await new Blog({title,summary,imgurl,desc,user:user.username});
        blog = await blog.save();
        user.blogs = [...user.blogs,blog._id];
        user = await user.save();
        res.status(200).json({message:"blog created successfully..",blog,user});
    } catch (error) {
      res.status(401).json({message:"failed.. ",error:error})
    }
    
})

app.get("/blogs",async(req,res)=>{
  try {
    let blogs = await Blog.find();
    res.status(200).json({blogs:blogs});
  } catch (error) {
    res.status(401).json({msg: "blogs not found"})
  }
})

app.get("/viewblog/:id",async(req,res)=>{
  let userid = req.params.id;
  try {
    let blog = await Blog.findOne({_id:userid});
    res.status(200).json({blog:blog});
  } catch (error) {
    res.status(404).json({msg:"blog not found"})
  }
})

// -------- -----  api for update blog by providing its id ---------

app.put("/update/blog/:id",async(req,res)=>{
  const userid = req.params.id;
  try {
    let userBlog = await Blog.findByIdAndUpdate({_id:userid},{$set:req.body});
    res.status(200).json({message:"data update successfully..",update:userBlog});
  } catch (error) {
    res.status(500).json({message:"data updation failed..",error:error});
  }
})


// -------- -----  api for delete blog by providing its id ---------

app.delete("/delete/blog/:blogid/:userid",async(req,res)=>{
  let blogid = req.params.blogid
  let userid = req.params.userid;

  try {
    const deletedUser = await Blog.findByIdAndDelete({_id:blogid});
    if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }else{
        let user = await User.findOne({_id:userid});
        let userBlogsarray = user.blogs;
        let newBlogArray = userBlogsarray.filter((ele)=>{
          return ele != blogid
        })
        user.blogs = newBlogArray;
        res.status(200).json({message:"delete successfully"}); // No content
      }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
  }
})
// app.get("/user/:id",async(req,res)=>{
//   let userid = req.params.id
  
//   res.json("ok")
//   user = user.blogs
//   deleteid = "6495fbc71ca62c6c0850c5ae"
//   let idfind = user.filter((id)=>{
//     return id != deleteid;
//   })
//   console.log(idfind)

// })
app.listen("https://reactblogapp.onrender.com", () => {
  console.log("backend running...");
});
