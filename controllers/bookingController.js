const bookingModel = require("../models/bookingModel");
const showModel = require("../models/showModel");

// =========================
// GET ALL BOOKINGS
// =========================
const getAllBookings = (req, res, next) => {
    try {
        const bookings = bookingModel.getAllBookings();

        res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
};


// =========================
// GET BOOKING BY ID
// =========================
const getBookingById = (req, res, next) => {
    try {
        const id = req.params.id;

        const booking = bookingModel.getBookingById(id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // Admin can access all bookings
        // Customer can access only their own booking
        if (
            req.user.role !== "admin" &&
            booking.user_id !== req.user.id
        ) {
            return res.status(403).json({
                message: "You are not allowed to access this booking"
            });
        }

        res.status(200).json(booking);

    } catch (error) {
        next(error);
    }
};


// =========================
// GET MY BOOKINGS
// =========================
const getMyBookings = (req, res, next) => {
    try {
        const userId = req.user.id;

        const bookings = bookingModel.getBookingsByUserId(userId);

        res.status(200).json(bookings);

    } catch (error) {
        next(error);
    }
};


// =========================
// CREATE BOOKING
// =========================
const createBooking = (req, res, next) => {
    try {
        const {
            customer_name,
            customer_email,
            show_id,
            seats_booked
        } = req.body;

        // Validate required fields
        if (
            !customer_name ||
            !customer_email ||
            !show_id ||
            !seats_booked
        ) {
            return res.status(400).json({
                message: "All booking fields are required"
            });
        }

        // Validate seats
        if (seats_booked <= 0) {
            return res.status(400).json({
                message: "Seats booked must be greater than 0"
            });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(customer_email)) {
            return res.status(400).json({
                message: "Invalid customer email"
            });
        }

        // Check show
        const show = showModel.getShowById(show_id);

        if (!show) {
            return res.status(404).json({
                message: "Show not found"
            });
        }

        // Check available seats
        if (seats_booked > show.available_seats) {
            return res.status(400).json({
                message: "Not enough available seats"
            });
        }

        // Create booking
        const booking = {
            customer_name,
            customer_email,
            show_id,
            seats_booked,
            user_id: req.user.id
        };

        const result = bookingModel.createBooking(booking);

        // Decrease available seats
        showModel.decreaseAvailableSeats(
            show_id,
            seats_booked
        );

        res.status(201).json({
            message: "Booking created successfully",
            bookingId: result.lastInsertRowid
        });

    } catch (error) {
        next(error);
    }
};


// =========================
// UPDATE BOOKING
// =========================
const updateBooking = (req, res, next) => {
    try {
        const id = req.params.id;

        const existingBooking =
            bookingModel.getBookingById(id);

        if (!existingBooking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // Ownership check
        if (
            req.user.role !== "admin" &&
            existingBooking.user_id !== req.user.id
        ) {
            return res.status(403).json({
                message: "You are not allowed to update this booking"
            });
        }

        const booking = req.body;

        const result =
            bookingModel.updateBooking(id, booking);

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            message: "Booking updated successfully"
        });

    } catch (error) {
        next(error);
    }
};


// =========================
// DELETE / CANCEL BOOKING
// =========================
const deleteBooking = (req, res, next) => {
    try {
        const id = req.params.id;

        const existingBooking =
            bookingModel.getBookingById(id);

        if (!existingBooking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // Ownership check
        if (
            req.user.role !== "admin" &&
            existingBooking.user_id !== req.user.id
        ) {
            return res.status(403).json({
                message: "You are not allowed to cancel this booking"
            });
        }

        // Delete booking
        const result =
            bookingModel.deleteBooking(id);

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // Restore seats
        showModel.increaseAvailableSeats(
            existingBooking.show_id,
            existingBooking.seats_booked
        );

        res.status(200).json({
            message: "Booking cancelled successfully",
            restoredSeats: existingBooking.seats_booked
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getAllBookings,
    getBookingById,
    getMyBookings,
    createBooking,
    updateBooking,
    deleteBooking
};