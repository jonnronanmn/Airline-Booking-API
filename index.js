const app = require("./app");
const mongoose = require("mongoose");

require('dotenv').config()

async function startServer() { // declare it normally
  try {
    await mongoose.connect(process.env.MONGODB_STRING)
    console.log("MongoDB Connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}|| 5000`);
    });
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
}

startServer();