const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const auth = require("../auth");


/* =========================================
   BOOK FLIGHT
========================================= */
router.post(
  "/",
  auth.verify,
  bookingController.bookFlight
);


/* =========================================
   CANCEL BOOKING
========================================= */
router.patch(
  "/:id/cancel",
  auth.verify,
  bookingController.cancelBooking
);


/* =========================================
   GET USER BOOKINGS
========================================= */
router.get(
  "/my-bookings",
  auth.verify,
  bookingController.getUserBookings
);


/* =========================================
   GET PASSENGERS PER FLIGHT (Admin)
========================================= */
router.get(
  "/flight/:flightId",
  auth.verify,
  bookingController.getFlightPassengers
);


// GET user booking history
router.get("/history", auth.verify, bookingController.getBookingHistory);

// GET user booking history
router.get("/history", auth.verify, bookingController.getBookingHistory);

// CANCEL booking
router.delete("/:id/cancel", auth.verify, bookingController.cancelBooking);

module.exports = router;
