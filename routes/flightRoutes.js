const express = require("express");
const router = express.Router();

const flightController = require("../controllers/flightController");
const auth = require("../auth");


/* =========================================
   CREATE FLIGHT (Protected / Admin)
========================================= */
router.post(
  "/",
  auth.verify,
  flightController.createFlights
);



/* =========================================
   GET ALL / SEARCH FLIGHTS
   Example:
   /flights?origin=MNL&destination=CEB&date=2026-02-10
========================================= */
router.get(
  "/",
  flightController.getFlights
);



/* =========================================
   GET SINGLE FLIGHT
========================================= */
router.get(
  "/:id",
  flightController.getFlightById
);



/* =========================================
   UPDATE FLIGHT (Protected)
========================================= */
router.put(
  "/:id",
  auth.verify,
  flightController.updateFlight
);



/* =========================================
   DELETE FLIGHT (Protected)
========================================= */
router.delete(
  "/:id",
  auth.verify,
  flightController.deleteFlight
);


module.exports = router;
