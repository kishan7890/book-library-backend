const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const generateToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });
  const token = generateToken(user);
  res.cookie("token", token, { httpOnly: true , secure: true , sameSite: "none" , maxAge: 7 * 24 * 60 * 60 * 1000 }).json({ user: { email } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = generateToken(user);
  res.cookie("token", token, { httpOnly: true , secure: true , sameSite: "none" , maxAge: 7 * 24 * 60 * 60 * 1000}).json({ user: { email } });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  }).json({ message: "Logged out" });
});

router.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    const user = await User.findById(decoded.id);
    res.json({ user: { email: user.email } });
  });
});

module.exports = router;
