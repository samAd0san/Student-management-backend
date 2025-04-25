const bcrypt = require("bcrypt");
const UserRepo = require("../repositories/userRepo");
const jwt = require("jsonwebtoken");
const config = require("../config/index");

const emailExists = (err) =>
  err.message && err.message.includes("duplicate key");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdDate: new Date(),
    };

    const savedUser = await UserRepo.create(user);
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
    const user = await UserRepo.getByEmail(email);

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send("Invalid email or password");
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwtSecret,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  signup,
  signin,
};
