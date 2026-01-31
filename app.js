const express = require("express");
const errorHandler = require("./middleware/errorHandlers");
const userRoutes = require("./routes/userRoutes");

const app = express();

require('dotenv').config()

// Middleware
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Place your API routes here later
// app.use("/api/expenses", require("./routes/expenses"));
app.use("/users", userRoutes);

app.use(errorHandler);

module.exports = app;