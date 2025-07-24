const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  coverImage: String,
  chapterImages: [String], // 👈 Add this line to store chapter image URLs
});

module.exports = mongoose.model("Book", bookSchema);
