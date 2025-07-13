const mongoose = require("mongoose");
const myBookSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  bookId: mongoose.Schema.Types.ObjectId,
  status: { type: String, default: "Want to Read" },
  rating: { type: Number, default: 0 },
});
module.exports = mongoose.model("MyBook", myBookSchema);