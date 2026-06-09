const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password, phone, roomNumber } = req.body;

  if (!name || !email || !password || !phone || !roomNumber) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (!email.endsWith("@karunya.edu.in")) {
    return res.status(400).json({
      message: "Only Karunya email addresses are allowed",
    });
  }

  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    roomNumber,
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      roomNumber: user.roomNumber,
      role: user.role,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
  return res.status(400).json({
    message: "Invalid email or password",
  });
  }
  const isMatch = await bcrypt.compare(
  password,
  user.password
  );
  
  if (!isMatch) {
  return res.status(400).json({
    message: "Invalid email or password",
  });
  }
  const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

  res.json({
  message: "Login Successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
});
};

module.exports = {
  registerUser,
  loginUser,
};