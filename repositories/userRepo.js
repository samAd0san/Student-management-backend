const User = require("../models/userModel");

const create = async (user) => {
  const newUser = new User(user);
  return await newUser.save();
};

const getByEmail = async (email) => {
  return await User.findOne({ email: email });
};

module.exports = {
  create,
  getByEmail,
};
