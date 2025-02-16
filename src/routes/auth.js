const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const auth = require("../middleware/auth");

const tokenBlacklist = new Set();
// Register
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    next(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "3h" }
  );
  res.json({ token });
});

// Get me 
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.json(user);
});



router.post("/logout", auth, (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  tokenBlacklist.add(token);
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
