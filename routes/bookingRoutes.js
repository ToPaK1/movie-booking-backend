const express = require("express");

const {
    getAllBookings,
    getMyBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking
} = require("../controllers/bookingController");

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    createBookingValidation,
    updateBookingValidation,
    bookingIdValidation
} = require("../middleware/validation");


// =====================================================
// ROUTER
// =====================================================

const router = express.Router();


// =====================================================
// GET ALL BOOKINGS
// =====================================================
// Authentication required

router.get(
    "/",
    authMiddleware,
    getAllBookings
);


// =====================================================
// GET MY BOOKINGS
// =====================================================

router.get(
    "/my",
    authMiddleware,
    getMyBookings
);


// =====================================================
// GET BOOKING BY ID
// =====================================================

router.get(
    "/:id",
    authMiddleware,
    bookingIdValidation,
    getBookingById
);


// =====================================================
// CREATE BOOKING
// =====================================================

router.post(
    "/",
    authMiddleware,
    createBookingValidation,
    createBooking
);


// =====================================================
// UPDATE BOOKING
// =====================================================

router.put(
    "/:id",
    authMiddleware,
    updateBookingValidation,
    updateBooking
);


// =====================================================
// DELETE BOOKING
// =====================================================

router.delete(
    "/:id",
    authMiddleware,
    bookingIdValidation,
    deleteBooking
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;