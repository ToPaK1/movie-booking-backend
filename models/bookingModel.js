const db = require("../config/database");

const getAllBookings = () => {
    return db.prepare("SELECT * FROM bookings").all();
};

const getBookingById = (id) => {
    return db.prepare("SELECT * FROM bookings WHERE id = ?").get(id);
};

const createBooking = (booking) => {
    const sql = `
        INSERT INTO bookings
        (customer_name, customer_email, show_id, seats_booked)
        VALUES (?, ?, ?, ?)
    `;

    return db.prepare(sql).run(
        booking.customer_name,
        booking.customer_email,
        booking.show_id,
        booking.seats_booked
    );
};

const updateBooking = (id, booking) => {
    const sql = `
        UPDATE bookings
        SET customer_name = ?,
            customer_email = ?,
            show_id = ?,
            seats_booked = ?
        WHERE id = ?
    `;

    return db.prepare(sql).run(
        booking.customer_name,
        booking.customer_email,
        booking.show_id,
        booking.seats_booked,
        id
    );
};

const deleteBooking = (id) => {
    return db.prepare(
        "DELETE FROM bookings WHERE id = ?"
    ).run(id);
};

module.exports = {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking
};