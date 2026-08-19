const db = require("../config/database");

const getAllBookings = () => {
    return db.prepare("SELECT * FROM bookings ORDER BY id DESC").all();
};

const getBookingsByUserId = (userId) => {
    return db
        .prepare("SELECT * FROM bookings WHERE user_id = ? ORDER BY id DESC")
        .all(userId);
};

module.exports = {
    getAllBookings,
    getBookingsByUserId
};