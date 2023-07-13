const fs = require("fs");
const User = require("../../models/users");
const Blog = require("../../models/blogs");

exports.findAllBlog = async (req, res) => {
  try {
    let blogs = await Blog.find();
    res.status(200).json({ blogs: blogs });
  } catch (error) {
    res.status(401).json({ msg: "blogs not found" });
  }
};

exports.findUserBlog = async (req, res) => {
  const user = req.params.user;
  const blogs = await Blog.find({ user: user });
  res.json({ blogs: blogs });
};

exports.createBlogWithUserId = async (req, res) => {
  let { title, summary, desc } = req.body;
  let file = req.file.originalname;

  const userid = req.params.id;
  let user = await User.findOne({ _id: userid });

  try {
    let blog = await new Blog({
      title,
      summary,
      imgurl: file,
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
    res.status(401).json({ message: "failed.. ", error: error });
  }
};

exports.viewBlogFromBlogId = async (req, res) => {
  let userid = req.params.id;
  try {
    let blog = await Blog.findOne({ _id: userid });
    res.status(200).json({ blog: blog });
  } catch (error) {
    res.status(404).json({ msg: "blog not found" });
  }
};

exports.updateBlogById = async (req, res) => {
  const userid = req.params.id;
  let { title, summary, desc } = req.body;
  let file = req.file.originalname;
  let tempBlog = await Blog.findOne({ _id: userid });
  let filepath = `./uploads/${tempBlog.imgurl}`;

  fs.unlink(filepath, (err) => {
    if (err) {
      console.log("image not delte while update blog  ==>");
    } else {
      console.log("image delete successfully while updating blog");
    }
  });
  
  try {
    let userBlog = await Blog.findByIdAndUpdate(
      { _id: userid },
      {
        $set: {
          title,
          summary,
          imgurl: file,
          desc,
        },
      }
    );
    res
      .status(200)
      .json({ message: "data update successfully..", update: userBlog });
  } catch (error) {
    res.status(500).json({ message: "data updation failed..", error: error });
  }
};

exports.deleteBlog = async (req, res) => {
  let blogid = req.params.blogid;
  let userid = req.params.userid;

  let imageDelte = await Blog.findOne({ _id: blogid });
  imageDelte = imageDelte.imgurl;
  let filepath = `./uploads/${imageDelte}`;

  fs.unlink(filepath, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("image delete successfully....");
    }
  });

  try {
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
    res.status(500).json({ message: "Server error" });
  }
};
