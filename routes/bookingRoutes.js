const express = require("express");

const {
    getAllBookings,
    getMyBookings,
    getBookingById,
    createBooking,
    deleteBooking
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

const {
    createBookingValidation,
    bookingIdValidation
} = require("../middleware/validation");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getAllBookings
);

router.get(
    "/my",
    authMiddleware,
    getMyBookings
);

router.get(
    "/:id",
    authMiddleware,
    bookingIdValidation,
    getBookingById
);

router.post(
    "/",
    authMiddleware,
    createBookingValidation,
    createBooking
);

router.delete(
    "/:id",
    authMiddleware,
    bookingIdValidation,
    deleteBooking
);

module.exports = router;
