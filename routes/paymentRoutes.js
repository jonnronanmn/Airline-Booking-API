const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");
const auth = require("../auth");


/* =========================================
   MAKE PAYMENT & CONFIRM BOOKING
========================================= */
router.post(
  "/pay",
  auth.verify,
  paymentController.makePayment
);


/* =========================================
   GET USER PAYMENTS
========================================= */
router.get(
  "/my-payments",
  auth.verify,
  paymentController.getUserPayments
);


module.exports = router;
