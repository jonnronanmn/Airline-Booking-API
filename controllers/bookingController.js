const Booking = require("../models/Booking");
const Flight = require("../models/Flight");


/* =========================================
   BOOK FLIGHT
========================================= */
module.exports.bookFlight = async (req, res) => {
  try {
    const { flightId, seatsBooked } = req.body;

    const userId = req.user.id; // from auth middleware

    if (!flightId || !seatsBooked) {
      return res.status(400).json({
        message: "Flight ID and seats booked are required"
      });
    }

    if (seatsBooked <= 0) {
      return res.status(400).json({
        message: "Seats booked must be greater than 0"
      });
    }

    // FIND FLIGHT
    const flight = await Flight.findById(flightId);

    if (!flight) {
      return res.status(404).json({
        message: "Flight not found"
      });
    }

    if (flight.status !== "ACTIVE") {
      return res.status(400).json({
        message: "Flight is not available for booking"
      });
    }

    if (flight.availableSeats < seatsBooked) {
      return res.status(400).json({
        message: "Not enough available seats"
      });
    }

    // CALCULATE PRICE
    const totalPrice = seatsBooked * flight.price;

    // CREATE BOOKING
    const booking = await Booking.create({
      userId,
      flightId,
      seatsBooked,
      totalPrice
    });

    // DEDUCT SEATS
    flight.availableSeats -= seatsBooked;
    await flight.save();

    return res.status(201).json({
      success: true,
      booking
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error. Could not book flight.",
      error: err.message
    });
  }
};

/* =========================================
   CANCEL BOOKING
========================================= */
module.exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({
        message: "Booking already cancelled"
      });
    }

    // FIND FLIGHT
    const flight = await Flight.findById(booking.flightId);

    if (!flight) {
      return res.status(404).json({
        message: "Associated flight not found"
      });
    }

    // RETURN SEATS
    flight.availableSeats += booking.seatsBooked;
    await flight.save();

    // UPDATE BOOKING STATUS
    booking.status = "CANCELLED";
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully"
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error. Could not cancel booking.",
      error: err.message
    });
  }
};

/* =========================================
   GET USER BOOKINGS
========================================= */
module.exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ userId })
      .populate("flightId");

    return res.status(200).json({
      count: bookings.length,
      bookings
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

/* =========================================
   GET FLIGHT PASSENGERS
========================================= */
module.exports.getFlightPassengers = async (req, res) => {
  try {
    const bookings = await Booking.find({
      flightId: req.params.flightId,
      status: "CONFIRMED"
    }).populate("userId", "name email");

    return res.status(200).json({
      count: bookings.length,
      passengers: bookings
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

/* =========================================
   GET USER BOOKING HISTORY
========================================= */
module.exports.getBookingHistory = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    // Find all bookings for this user and populate flight details
    const bookings = await Booking.find({ userId })
      .populate("flightId")
      .sort({ createdAt: -1 }); // latest bookings first

    if (bookings.length === 0) {
      return res.status(200).json({
        message: "No bookings found",
        bookings: []
      });
    }

    return res.status(200).json({
      count: bookings.length,
      bookings
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error while fetching booking history",
      error: err.message
    });
  }
};


/* =========================================
   CANCEL BOOKING
========================================= */
module.exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id; // booking ID from URL
    const userId = req.user.id;

    // Find booking
    const booking = await Booking.findById(bookingId).populate("flightId");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check ownership
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: "You cannot cancel this booking" });
    }

    // Already cancelled?
    if (booking.status === "CANCELLED") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // Update booking status
    booking.status = "CANCELLED";
    await booking.save();

    // Optionally, update flight available seats
    booking.flightId.availableSeats += booking.seatsBooked;
    await booking.flightId.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error while cancelling booking",
      error: err.message
    });
  }
};
