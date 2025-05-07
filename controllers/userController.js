const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const User = require("../models/userModel");

const emailExists = (err) =>
  err.message && err.message.includes("duplicate key");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'user', // Default to 'user' if role not specified
      createdDate: new Date(),
    });

    const savedUser = await user.save();
    res.status(201).json({
      message: "User created successfully",
      userId: savedUser._id,
    });
  } catch (err) {
    if (emailExists(err)) {
      res.status(400).send("Email already exists");
    } else {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send("Invalid email or password");
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role // Include role in token
      },
      config.jwtSecret,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    // Remove sensitive information like passwords before sending
    const sanitizedUsers = users.map(user => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdDate: user.createdDate
    }));
    res.json(sanitizedUsers);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  signup,
  signin,
  getAllUsers,
  deleteUser
};
