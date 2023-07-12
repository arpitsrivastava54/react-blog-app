const express = require ("express");
const router = express.Router();
const userControl = require("./controlers/userControler")
const blogControl = require("./controlers/blogControler")
const multer = require("multer");


const imagePath = multer.diskStorage({
    destination:(req,file,cb)=>{
      console.log(cb)
      cb(null,"./uploads")
  },
  filename:(req,file,cb)=>{
      cb(null,file.originalname)
  }
 
  
})

const upload = multer ({
  storage:imagePath
})

// user api 

router.post("/user/register",userControl.userRegister);
router.put("/user/update/:id",userControl.userUpdate);
router.post("/user/login",userControl.userLogin);

// blog api 
router.get("/blogs",blogControl.findAllBlog);
router.get("/user/blog/:user",blogControl.findUserBlog);
router.use("/blog/new/:id",upload.single("photo"),blogControl.createBlogWithUserId);
router.get("/viewblog/:id",blogControl.viewBlogFromBlogId);
router.put("/update/blog/:id",upload.single("photo"),blogControl.updateBlogById);
router.delete("/delete/blog/:blogid/:userid",blogControl.deleteBlog);


module.exports = router;