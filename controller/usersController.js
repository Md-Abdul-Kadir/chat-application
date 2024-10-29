const bcrypt = require("bcrypt");
const User = require("../models/People");
const { unlink } = require("../router/userRouter");

async function getUsers(req, res, next) {
  try {
    const users = await User.find();
    res.render("users", {
      users: users,
    });
  } catch (err) {
    next(err);
  }
}

async function addUser(req, res, next) {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  if (req.files && req.files.length > 0) {
    newUser = new User({
      ...req.body,
      avatar: req.files[0].filename,
      password: hashedPassword,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }

  try {
    const result = await newUser.save();
    res.status(200).json({ message: "User added successfully", user: result });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred while Upload avatar ",
    });
  }
}

async function removeUser(req, res, next) {
  const id = req.params.id;
  try {
    const detetedUser = await User.findByIdAndDelete({
      _id: id,
    });

    if (detetedUser.avatar) {
      unlink(
        path.join(
          __dirname,
          `/../public/uploads/avatars/${detetedUser.avatar}`
        ),
        (err) => {
          if (errr) console.log(err);
        }
      );
    }
    res.status(200).json({ message: "User Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Could not Delete user" });
  }
}

module.exports = { getUsers, addUser, removeUser };
