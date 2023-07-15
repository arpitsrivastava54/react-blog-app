const User = require("../../models/users");
const Blog = require("../../models/blogs");

exports.getalldata = (req, res) => {
  res.send("all okk arpit dont worry");
};

exports.userRegister = async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await new User({ username: username, password: password });
    user = await user.save();
    res.status(200).json({ message: "registration successfull..", user: user });
  } catch (error) {
    console.log("error");
    res.status(404).json("registration failed..");
  }
};

exports.userUpdate = async (req, res) => {
  const userid = req.params.id;
  try {
    let user = await User.findByIdAndUpdate(
      { _id: userid },
      { $set: req.body }
    );
    res.status(200).json({ message: "data update successfully..", user: user });
  } catch (error) {
    res.status(500).json({ message: "data updation failed..", error: error });
  }
};

exports.userLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username: username, password: password });
    if (user) {
      res.status(200).json({ message: "user found", user: user });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res
      .status(404)
      .json({ message: "unnable to fetch from backend server..." });
  }
};
