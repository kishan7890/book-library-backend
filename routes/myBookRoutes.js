const express = require("express");
const jwt = require("jsonwebtoken");
const MyBook = require("../models/MyBook");
const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

router.get("/", authenticate, async (req, res) => {
  try {
    const books = await MyBook.find({ userId: req.userId })
      .populate("bookId", "title author description coverImage"); // include fields you need

    const formatted = books.map(entry => ({
      bookId: entry.bookId._id,
      status: entry.status,
      rating: entry.rating,
      book: {
        _id: entry.bookId._id,
        title: entry.bookId.title,
        author: entry.bookId.author,
        description: entry.bookId.description,
        coverImage: entry.bookId.coverImage,
      },
    }));

    res.json({ books: formatted });
  } catch (err) {
    console.error("Error fetching my books:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/:bookId", authenticate, async (req, res) => {
  const { bookId } = req.params;
  const exists = await MyBook.findOne({ userId: req.userId, bookId });
  if (!exists) await MyBook.create({ userId: req.userId, bookId });
  res.json({ message: "Added to MyBooks" });
});

router.patch("/:bookId/status", authenticate, async (req, res) => {
  const { status } = req.body;
  await MyBook.findOneAndUpdate({ userId: req.userId, bookId: req.params.bookId }, { status });
  res.json({ message: "Status updated" });
});

router.patch("/:bookId/rating", authenticate, async (req, res) => {
  const { rating } = req.body;
  await MyBook.findOneAndUpdate({ userId: req.userId, bookId: req.params.bookId }, { rating });
  res.json({ message: "Rating updated" });
});

module.exports = router;