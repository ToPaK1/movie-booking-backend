const bookingModel = require("../models/bookingModel");
const showModel = require("../models/showModel");
const nodemailer = require("nodemailer");

const transporter = process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    })
    : null;

const sendConfirmationEmail = async (booking) => {
    if (!transporter) {
        console.warn("Gmail is not configured. Confirmation email skipped.");
        return;
    }

    const seats = JSON.parse(booking.selected_seats || "[]").join(", ");

    await transporter.sendMail({
        from: `CineBook <${process.env.EMAIL_USER}>`,
        to: booking.customer_email,
        subject: `CineBook Confirmation #${booking.id}`,
        html: `
            <div style="font-family:Arial,sans-serif;background:#08090d;padding:30px;color:#fff">
              <div style="max-width:600px;margin:auto;background:#12151d;border-radius:18px;overflow:hidden;border:1px solid #2b303b">
                <div style="background:#e50914;padding:25px"><h1 style="margin:0">CINEBOOK</h1><p style="margin:6px 0 0">Booking confirmed 🎟️</p></div>
                <div style="padding:28px">
                  <h2>${booking.movie_title}</h2>
                  <p><b>Booking:</b> #${booking.id}</p>
                  <p><b>Cinema:</b> ${booking.cinema_name}</p>
                  <p><b>Date:</b> ${booking.show_date}</p>
                  <p><b>Time:</b> ${booking.show_time}</p>
                  <p><b>Seats:</b> ${seats}</p>
                  <p><b>Tickets:</b> ${booking.seats_booked}</p>
                  <p><b>Price per ticket:</b> EGP ${Number(booking.ticket_price).toFixed(2)}</p>
                  <h2>Total: EGP ${Number(booking.total_price).toFixed(2)}</h2>
                  <p style="color:#aeb4c0">Please keep this email as your booking confirmation.</p>
                </div>
              </div>
            </div>`
    });
};

const getAllBookings = (req, res, next) => {
    try { res.status(200).json(bookingModel.getAllBookings()); } catch (error) { next(error); }
};

const getMyBookings = (req, res, next) => {
    try { res.status(200).json(bookingModel.getBookingsByUserId(req.user.id)); } catch (error) { next(error); }
};

const getBookingById = (req, res, next) => {
    try {
        const booking = bookingModel.getBookingById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        if (booking.user_id !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "You cannot access this booking" });
        }
        res.status(200).json(booking);
    } catch (error) { next(error); }
};

const createBooking = async (req, res, next) => {
    try {
        const { show_id, selected_seats } = req.body;
        const user = req.user;
        const seats = Array.isArray(selected_seats) ? selected_seats : [];
        const show = showModel.getShowById(show_id);

        if (!show) return res.status(404).json({ message: "Show not found" });
        if (!seats.length) return res.status(400).json({ message: "Please select at least one seat" });
        if (new Set(seats).size !== seats.length) return res.status(400).json({ message: "Duplicate seats are not allowed" });
        if (seats.length > show.available_seats) return res.status(400).json({ message: "Not enough seats are available" });

        const occupied = new Set(showModel.getBookedSeats(show_id));
        const alreadyBooked = seats.filter(seat => occupied.has(seat));
        if (alreadyBooked.length) {
            return res.status(409).json({ message: `These seats are already booked: ${alreadyBooked.join(", ")}` });
        }

        const ticketPrice = Number(show.ticket_price);
        const totalPrice = ticketPrice * seats.length;
        const db = require("../config/database");

        const createTransaction = db.transaction(() => {
            const result = bookingModel.createBooking({
                customer_name: user.name,
                customer_email: user.email,
                user_id: user.id,
                show_id,
                seats_booked: seats.length,
                selected_seats: seats,
                ticket_price: ticketPrice,
                total_price: totalPrice
            });
            const updated = showModel.decreaseAvailableSeats(show_id, seats.length);
            if (updated.changes !== 1) throw new Error("Not enough seats are available");
            return result;
        });

        const result = createTransaction();
        const booking = bookingModel.getBookingById(result.lastInsertRowid);

        // Email failure must not cancel an already successful booking.
        try { await sendConfirmationEmail(booking); }
        catch (emailError) { console.error("Booking email failed:", emailError.message); }

        res.status(201).json({ message: "Booking created successfully", bookingId: result.lastInsertRowid, booking });
    } catch (error) { next(error); }
};

const deleteBooking = (req, res, next) => {
    try {
        const booking = bookingModel.getBookingById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        if (booking.user_id !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "You cannot delete this booking" });
        }
        const db = require("../config/database");
        const transaction = db.transaction(() => {
            const result = bookingModel.deleteBooking(req.params.id);
            if (result.changes) showModel.increaseAvailableSeats(booking.show_id, booking.seats_booked);
            return result;
        });
        const result = transaction();
        if (!result.changes) return res.status(404).json({ message: "Booking not found" });
        res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) { next(error); }
};

module.exports = { getAllBookings, getMyBookings, getBookingById, createBooking, deleteBooking };