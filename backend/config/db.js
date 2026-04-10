const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGO_URI_LOCAL;

    if (!uri) {
      throw new Error("MongoDB connection string (MONGO_URI) is missing!");
    }

    
    await mongoose.connect(uri);

    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.log("DB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;