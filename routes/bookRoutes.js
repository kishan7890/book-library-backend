const express = require("express");
const jwt = require("jsonwebtoken");
const Book = require("../models/Book");
const upload = require("../middleware/upload");

const router = express.Router();

// 🔐 Auth middleware
const authenticate = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); // ✅ Fetch user from DB
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // ✅ Attach full user object
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
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

router.post(
  "/add",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "chapterImages", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      if (req.user.email !== "kishansahu9348@gmail.com") {
        return res.status(403).json({ message: "Only admin can add books." });
      }

      const { title, author, description } = req.body;
      const coverImage = req.files.coverImage?.[0]?.path || "";
      const chapterImages = req.files.chapterImages?.map((file) => file.path) || [];

      const newBook = new Book({
        title,
        author,
        description,
        coverImage,
        chapterImages,
      });

      await newBook.save();
      res.status(201).json({ message: "Book added successfully", book: newBook });
    } catch (error) {
      console.error("Add Book Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

module.exports = router;
