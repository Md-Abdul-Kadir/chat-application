const bcrypt = require("bcrypt");
const User = require("../models/People");

function getUsers(req, res, next) {
  res.render("users");
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
    req.status(500).json({
      message: "An error occurred while Upload avatar ",
    });
  }
}

module.exports = { getUsers, addUser };
