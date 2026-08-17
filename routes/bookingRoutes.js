const express = require("express");

const router = express.Router();

const bookingController =
    require("../controllers/bookingController");

const authMiddleware =
    require("../middleware/authMiddleware");


// Get all bookings
router.get(
    "/",
    authMiddleware,
    bookingController.getAllBookings
);


// Get current user's bookings
router.get(
    "/my",
    authMiddleware,
    bookingController.getMyBookings
);


// Get booking by ID
router.get(
    "/:id",
    authMiddleware,
    bookingController.getBookingById
);


// Create booking
router.post(
    "/",
    authMiddleware,
    bookingController.createBooking
);


// Update booking
router.put(
    "/:id",
    authMiddleware,
    bookingController.updateBooking
);


// Delete booking
router.delete(
    "/:id",
    authMiddleware,
    bookingController.deleteBooking
);


module.exports = router;