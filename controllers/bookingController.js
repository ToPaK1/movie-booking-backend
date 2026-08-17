const bookingModel = require("../models/bookingModel");


// ================= GET ALL BOOKINGS =================

const getAllBookings = (req, res, next) => {

    try {

        const bookings =
            bookingModel.getAllBookings();

        res.status(200).json(bookings);

    } catch (error) {

        next(error);

    }

};


// ================= GET MY BOOKINGS =================

const getMyBookings = (req, res, next) => {

    try {

        const userId = req.user.id;

        const bookings =
            bookingModel.getBookingsByUserId(userId);

        res.status(200).json(bookings);

    } catch (error) {

        next(error);

    }

};


// ================= GET BOOKING BY ID =================

const getBookingById = (req, res, next) => {

    try {

        const id = req.params.id;

        const booking =
            bookingModel.getBookingById(id);


        if (!booking) {

            return res.status(404).json({

                message: "Booking not found"

            });

        }


        // User can only see his own booking
        // Admin can see any booking

        if (
            booking.user_id !== req.user.id &&
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                message:
                    "You cannot access this booking"

            });

        }


        res.status(200).json(booking);

    } catch (error) {

        next(error);

    }

};


// ================= CREATE BOOKING =================

const createBooking = (req, res, next) => {

    try {

        const booking = {

            customer_name:
                req.body.customer_name,

            customer_email:
                req.body.customer_email,

            show_id:
                req.body.show_id,

            seats_booked:
                req.body.seats_booked,

            // Get user ID from JWT
            user_id:
                req.user.id

        };


        const result =
            bookingModel.createBooking(booking);


        res.status(201).json({

            message:
                "Booking created successfully",

            bookingId:
                result.lastInsertRowid

        });

    } catch (error) {

        next(error);

    }

};


// ================= UPDATE BOOKING =================

const updateBooking = (req, res, next) => {

    try {

        const id =
            req.params.id;


        const existingBooking =
            bookingModel.getBookingById(id);


        if (!existingBooking) {

            return res.status(404).json({

                message:
                    "Booking not found"

            });

        }


        // Only owner or admin can update

        if (
            existingBooking.user_id !== req.user.id &&
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                message:
                    "You cannot update this booking"

            });

        }


        const booking = {

            customer_name:
                req.body.customer_name,

            customer_email:
                req.body.customer_email,

            show_id:
                req.body.show_id,

            seats_booked:
                req.body.seats_booked

        };


        const result =
            bookingModel.updateBooking(
                id,
                booking
            );


        if (result.changes === 0) {

            return res.status(404).json({

                message:
                    "Booking not found"

            });

        }


        res.status(200).json({

            message:
                "Booking updated successfully"

        });

    } catch (error) {

        next(error);

    }

};


// ================= DELETE BOOKING =================

const deleteBooking = (req, res, next) => {

    try {

        const id =
            req.params.id;


        const existingBooking =
            bookingModel.getBookingById(id);


        if (!existingBooking) {

            return res.status(404).json({

                message:
                    "Booking not found"

            });

        }


        // Only owner or admin can delete

        if (
            existingBooking.user_id !== req.user.id &&
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                message:
                    "You cannot delete this booking"

            });

        }


        const result =
            bookingModel.deleteBooking(id);


        if (result.changes === 0) {

            return res.status(404).json({

                message:
                    "Booking not found"

            });

        }


        res.status(200).json({

            message:
                "Booking deleted successfully"

        });

    } catch (error) {

        next(error);

    }

};


// ================= EXPORT =================

module.exports = {

    getAllBookings,

    getMyBookings,

    getBookingById,

    createBooking,

    updateBooking,

    deleteBooking

};