const Flight = require("../models/Flight");


/* =========================================
   CREATE FLIGHT
========================================= */
module.exports.createFlights = async (req, res) => {
  try {
    const {
      flightNumber,
      origin,
      destination,
      departureTime,
      arrivalTime,
      price,
      totalSeats
    } = req.body;

    // REQUIRED FIELDS
    const requiredFields = [
      flightNumber,
      origin,
      destination,
      departureTime,
      arrivalTime,
      price,
      totalSeats
    ];

    if (requiredFields.some(field => !field)) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // BUSINESS RULES
    if (origin === destination) {
      return res.status(400).json({
        message: "Origin and destination cannot be the same"
      });
    }

    if (Number(totalSeats) <= 0 || Number(price) <= 0) {
      return res.status(400).json({
        message: "Total seats and price must be greater than 0"
      });
    }

    if (new Date(departureTime) >= new Date(arrivalTime)) {
      return res.status(400).json({
        message: "Arrival time must be after departure time"
      });
    }

    // CHECK DUPLICATE FLIGHT NUMBER
    const existingFlight = await Flight.findOne({ flightNumber });

    if (existingFlight) {
      return res.status(409).json({
        message: "Flight number already exists"
      });
    }

    // CREATE
    const flight = await Flight.create({
      flightNumber,
      origin,
      destination,
      departureTime,
      arrivalTime,
      price,
      totalSeats,
      availableSeats: totalSeats,
      status: "ACTIVE"
    });

    return res.status(201).json({
      success: true,
      flight
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error. Could not create flight.",
      error: err.message
    });
  }
};



/* =========================================
   GET ALL / SEARCH FLIGHTS
========================================= */
module.exports.getFlights = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    const filter = {};

    if (origin) filter.origin = origin;
    if (destination) filter.destination = destination;

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      filter.departureTime = {
        $gte: start,
        $lte: end
      };
    }

    const flights = await Flight.find(filter);

    return res.status(200).json({
      count: flights.length,
      flights
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error. Could not fetch flights.",
      error: err.message
    });
  }
};



/* =========================================
   GET SINGLE FLIGHT
========================================= */
module.exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({
        message: "Flight not found"
      });
    }

    return res.status(200).json(flight);

  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};



/* =========================================
   UPDATE FLIGHT
========================================= */
module.exports.updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({
        message: "Flight not found"
      });
    }

    // Prevent negative seats
    if (req.body.totalSeats && req.body.totalSeats <= 0) {
      return res.status(400).json({
        message: "Total seats must be greater than 0"
      });
    }

    if (req.body.price && req.body.price <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0"
      });
    }

    Object.assign(flight, req.body);

    await flight.save();

    return res.status(200).json({
      success: true,
      flight
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error. Could not update flight.",
      error: err.message
    });
  }
};



/* =========================================
   DELETE FLIGHT
========================================= */
module.exports.deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);

    if (!flight) {
      return res.status(404).json({
        message: "Flight not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Flight deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error. Could not delete flight.",
      error: err.message
    });
  }
};
