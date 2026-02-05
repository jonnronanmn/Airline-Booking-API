const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Flight = require("../models/Flight");
const { v4: uuidv4 } = require("uuid"); // for transaction IDs


/* =========================================
   MAKE PAYMENT & CONFIRM BOOKING
========================================= */
module.exports.makePayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!bookingId || !paymentMethod) {
      return res.status(400).json({
        message: "Booking ID and payment method are required"
      });
    }

    // FIND BOOKING
    const booking = await Booking.findById(bookingId).populate("flightId");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check user owns this booking
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: "You cannot pay for this booking" });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({ message: "Booking is cancelled" });
    }

    // MOCK PAYMENT PROCESS
    const transactionId = uuidv4(); // unique transaction reference

    const payment = await Payment.create({
      bookingId,
      userId,
      amount: booking.totalPrice,
      paymentMethod,
      status: "COMPLETED", // In real app, would depend on payment gateway
      transactionId
    });

    // GENERATE E-TICKET
    const ticketNumber = "TKT-" + Math.floor(100000 + Math.random() * 900000); // 6-digit ticket

    booking.status = "CONFIRMED";
    booking.ticketNumber = ticketNumber;
    await booking.save();

    return res.status(201).json({
      success: true,
      message: "Payment successful, booking confirmed",
      payment,
      ticketNumber,
      flight: booking.flightId
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error. Payment failed",
      error: err.message
    });
  }
};


/* =========================================
   GET USER PAYMENTS
========================================= */
module.exports.getUserPayments = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.find({ userId }).populate({
      path: "bookingId",
      populate: { path: "flightId" }
    });

    return res.status(200).json({
      count: payments.length,
      payments
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
