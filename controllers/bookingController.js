const bookingModel = require("../models/bookingModel");

const getAllBookings = (req, res) => {
    try {
        const bookings = bookingModel.getAllBookings();

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching bookings",
            error: error.message
        });
    }
};

const getBookingById = (req, res) => {
    try {
        const id = req.params.id;
        const booking = bookingModel.getBookingById(id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching booking",
            error: error.message
        });
    }
};

const createBooking = (req, res) => {
    try {
        const booking = req.body;

        const result = bookingModel.createBooking(booking);

        res.status(201).json({
            message: "Booking created successfully",
            bookingId: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating booking",
            error: error.message
        });
    }
};

const updateBooking = (req, res) => {
    try {
        const id = req.params.id;
        const booking = req.body;

        const result = bookingModel.updateBooking(id, booking);

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            message: "Booking updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating booking",
            error: error.message
        });
    }
};

const deleteBooking = (req, res) => {
    try {
        const id = req.params.id;

        const result = bookingModel.deleteBooking(id);

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            message: "Booking deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting booking",
            error: error.message
        });
    }
};

module.exports = {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking
};