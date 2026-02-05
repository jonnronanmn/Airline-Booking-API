const express = require("express");
const errorHandler = require("./middleware/errorHandlers");
const userRoutes = require("./routes/userRoutes");
const flightRoutes = require("./routes/flightRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();



// Middleware
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Place your API routes here later
// app.use("/api/expenses", require("./routes/expenses"));
app.use("/users", userRoutes);
app.use("/flight", flightRoutes);
app.use("/booking", bookingRoutes);
app.use("/payments", paymentRoutes);

app.use(errorHandler);

module.exports = app;