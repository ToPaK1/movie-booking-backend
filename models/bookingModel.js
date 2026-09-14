const db = require("../config/database");

const bookingSelect = `
    SELECT
        b.id,
        b.customer_name,
        b.customer_email,
        b.user_id,
        b.show_id,
        b.seats_booked,
        b.selected_seats,
        b.ticket_price,
        b.total_price,
        m.title AS movie_title,
        c.name AS cinema_name,
        s.show_date,
        s.show_time
    FROM bookings b
    JOIN shows s ON s.id = b.show_id
    JOIN movies m ON m.id = s.movie_id
    JOIN cinemas c ON c.id = s.cinema_id
`;

const getAllBookings = () => db.prepare(`${bookingSelect} ORDER BY b.id DESC`).all();

const getBookingsByUserId = (userId) =>
    db.prepare(`${bookingSelect} WHERE b.user_id = ? ORDER BY b.id DESC`).all(userId);

const getBookingById = (id) =>
    db.prepare(`${bookingSelect} WHERE b.id = ?`).get(id);

const createBooking = ({
    customer_name,
    customer_email,
    user_id,
    show_id,
    seats_booked,
    selected_seats,
    ticket_price,
    total_price
}) => db.prepare(`
    INSERT INTO bookings
    (customer_name, customer_email, user_id, show_id, seats_booked, selected_seats, ticket_price, total_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    customer_name,
    customer_email,
    user_id,
    show_id,
    seats_booked,
    JSON.stringify(selected_seats),
    ticket_price,
    total_price
);

const deleteBooking = (id) => db.prepare(`DELETE FROM bookings WHERE id = ?`).run(id);

module.exports = {
    getAllBookings,
    getBookingsByUserId,
    getBookingById,
    createBooking,
    deleteBooking
};