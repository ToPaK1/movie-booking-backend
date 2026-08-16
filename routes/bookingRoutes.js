const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

const authenticateToken =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

// Admin only
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    bookingController.getAllBookings
);

// Customer's own bookings
router.get(
    "/my-bookings",
    authenticateToken,
    bookingController.getMyBookings
);

// Get one booking
router.get(
    "/:id",
    authenticateToken,
    bookingController.getBookingById
);

// Create booking
router.post(
    "/",
    authenticateToken,
    bookingController.createBooking
);

// Update booking
router.put(
    "/:id",
    authenticateToken,
    bookingController.updateBooking
);

// Cancel booking
router.delete(
    "/:id",
    authenticateToken,
    bookingController.deleteBooking
);

module.exports = router;