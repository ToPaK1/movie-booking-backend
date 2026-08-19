const db = require("../config/database");


// =====================================================
// GET ALL BOOKINGS
// =====================================================

const getAllBookings = () => {

    return db.prepare(`
        SELECT
            id,
            customer_name,
            customer_email,
            user_id,
            show_id,
            seats_booked
        FROM bookings
        ORDER BY id DESC
    `).all();

};


// =====================================================
// GET BOOKINGS BY USER ID
// =====================================================

const getBookingsByUserId = (userId) => {

    return db.prepare(`
        SELECT
            id,
            customer_name,
            customer_email,
            user_id,
            show_id,
            seats_booked
        FROM bookings
        WHERE user_id = ?
        ORDER BY id DESC
    `).all(userId);

};


// =====================================================
// GET BOOKING BY ID
// =====================================================

const getBookingById = (id) => {

    return db.prepare(`
        SELECT
            id,
            customer_name,
            customer_email,
            user_id,
            show_id,
            seats_booked
        FROM bookings
        WHERE id = ?
    `).get(id);

};


// =====================================================
// CREATE BOOKING
// =====================================================

const createBooking = ({
    customer_name,
    customer_email,
    user_id,
    show_id,
    seats_booked
}) => {

    const stmt = db.prepare(`
        INSERT INTO bookings
        (
            customer_name,
            customer_email,
            user_id,
            show_id,
            seats_booked
        )
        VALUES (?, ?, ?, ?, ?)
    `);

    return stmt.run(
        customer_name,
        customer_email,
        user_id,
        show_id,
        seats_booked
    );

};


// =====================================================
// UPDATE BOOKING
// =====================================================

const updateBooking = (
    id,
    {
        customer_name,
        customer_email,
        show_id,
        seats_booked
    }
) => {

    return db.prepare(`
        UPDATE bookings
        SET
            customer_name = ?,
            customer_email = ?,
            show_id = ?,
            seats_booked = ?
        WHERE id = ?
    `).run(
        customer_name,
        customer_email,
        show_id,
        seats_booked,
        id
    );

};


// =====================================================
// DELETE BOOKING
// =====================================================

const deleteBooking = (id) => {

    return db.prepare(`
        DELETE FROM bookings
        WHERE id = ?
    `).run(id);

};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    getAllBookings,
    getBookingsByUserId,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking

};