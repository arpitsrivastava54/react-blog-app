const User = require("../../models/users");
const Blog = require("../../models/blogs");
const Image = require("../../models/images");

exports.findAllBlog = async (req, res) => {
  try {
    let blogs = await Blog.find();
    let images = await Image.find();
    res.status(200).json({ blogs: blogs,images:images});
  } catch (error) {
    res.status(401).json({ msg: "blogs not found" });
  }
};

exports.findUserBlog = async (req, res) => {
  const user = req.params.user;
  let images = await Image.find();
  const blogs = await Blog.find({ user: user });
  res.json({ blogs: blogs,images:images });
};

exports.createBlogWithUserId = async (req, res) => {
  let { title, summary, desc, file } = req.body;

  const userid = req.params.id;

  let user = await User.findOne({ _id: userid });
  try {
    let image = await new Image({ url: file });
    image = await image.save();
    let blog = await new Blog({
      title,
      summary,
      imgurl: image._id,
      desc,
      user: user.username,
    });
    blog = await blog.save();
    user.blogs = [...user.blogs, blog._id];
    user = await user.save();
    res
      .status(200)
      .json({ message: "blog created successfully..", blog, user });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "failed.. ", error: error.message });
  }
};

exports.viewBlogFromBlogId = async (req, res) => {
  let userid = req.params.id;
  try {
    let blog = await Blog.findOne({ _id: userid });
    let images = await Image.findOne({_id:blog.imgurl})
    res.status(200).json({ blog: blog,images:images });
  } catch (error) {
    res.status(404).json({ msg: "blog not found" });
  }
};

exports.updateBlogById = async (req, res) => {
  const userid = req.params.id;
  try {
  let blog = await Blog.findOne({ _id: userid });
  let imageId = blog.imgurl
  let delteImage = await Image.findByIdAndDelete({_id:imageId})
  if(!delteImage){
    res.status(401).json({msg:error.message});
  }
    let image = await new Image({url:req.body.file})
    image = await image.save();
    let userBlog = await Blog.findByIdAndUpdate({_id:userid},{$set:{
      title:req.body.title,
      summary:req.body.summary,
      imgurl:image._id,
      desc:req.body.desc,
    }})
    await userBlog.save();
    res
      .status(200)
      .json({ message: "data update successfully..", update: userBlog });
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
};

exports.deleteBlog = async (req, res) => {
  let blogid = req.params.blogid;
  let userid = req.params.userid;

  try {
    let tempBlog = await Blog.findOne({_id:blogid});
    console.log(tempBlog)
    let deleteImage = tempBlog.imgurl;
    let image = await Image.findByIdAndDelete({_id:deleteImage})
    if(!image){
      return res.status(404).json({message:"image not delete !!"})
    }
    const deletedUser = await Blog.findByIdAndDelete({ _id: blogid });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      let user = await User.findOne({ _id: userid });
      let userBlogsarray = user.blogs;
      let newBlogArray = userBlogsarray.filter((ele) => {
        return ele != blogid;
      });
      user.blogs = newBlogArray;
      await user.save();
      res.status(200).json({ message: "delete successfully" }); // No content
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
