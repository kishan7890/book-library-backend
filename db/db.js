const mongoose= require("mongoose");
require("dotenv").config()



const connectDB = async()=>{
    try {
       await mongoose.connect(process.env.MONGO_URI);
       console.log("connected to db");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {connectDB}