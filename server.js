const express = require("express");
const {connectDB} = require("./db/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const myBookRoutes = require("./routes/myBookRoutes");

const app = express();

app.use(cors({ origin: "https://book-library-backend-0vas.onrender.com", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/mybooks", myBookRoutes);

app.listen(8080, ()=>{
    connectDB();
    console.log("App is running on port http://localhost:8080");
})