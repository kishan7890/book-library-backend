const express = require("express");
const jwt = require("jsonwebtoken");
const Book = require("../models/Book");

const router = express.Router();

// 🔐 Auth middleware
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

// 📚 Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json({ books });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📖 Get a book's chapter images (auth protected)
router.get("/:id/chapters", authenticate, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json({
      title: book.title,
      coverImage: book.coverImage,
      chapters: book.chapterImages,
    });
  } catch (err) {
    console.error("Chapter fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
