const db = require("../config/database");

const showSelect = `
    SELECT
        s.id,
        s.movie_id,
        s.cinema_id,
        s.show_date,
        s.show_time,
        s.available_seats,
        s.ticket_price,
        m.title AS movie_title,
        c.name AS cinema_name
    FROM shows s
    JOIN movies m ON m.id = s.movie_id
    JOIN cinemas c ON c.id = s.cinema_id
`;

const getAllShows = () => db.prepare(`${showSelect} ORDER BY s.show_date, s.show_time`).all();
const getShowById = (id) => db.prepare(`${showSelect} WHERE s.id = ?`).get(id);

const getBookedSeats = (showId) => {
    const rows = db.prepare(`SELECT selected_seats FROM bookings WHERE show_id = ?`).all(showId);
    const seats = [];
    for (const row of rows) {
        try {
            const parsed = JSON.parse(row.selected_seats || "[]");
            if (Array.isArray(parsed)) seats.push(...parsed);
        } catch (_) {}
    }
    return seats;
};

const createShow = (show) => db.prepare(`
    INSERT INTO shows (movie_id, cinema_id, show_date, show_time, available_seats, ticket_price)
    VALUES (?, ?, ?, ?, ?, ?)
`).run(show.movie_id, show.cinema_id, show.show_date, show.show_time, show.available_seats, show.ticket_price);

const updateShow = (id, show) => db.prepare(`
    UPDATE shows SET movie_id = ?, cinema_id = ?, show_date = ?, show_time = ?, available_seats = ?, ticket_price = ? WHERE id = ?
`).run(show.movie_id, show.cinema_id, show.show_date, show.show_time, show.available_seats, show.ticket_price, id);

const deleteShow = (id) => db.prepare("DELETE FROM shows WHERE id = ?").run(id);

const decreaseAvailableSeats = (showId, seats) => db.prepare(`
    UPDATE shows SET available_seats = available_seats - ? WHERE id = ? AND available_seats >= ?
`).run(seats, showId, seats);

const increaseAvailableSeats = (showId, seats) => db.prepare(`
    UPDATE shows SET available_seats = available_seats + ? WHERE id = ?
`).run(seats, showId);

module.exports = {
    getAllShows,
    getShowById,
    getBookedSeats,
    createShow,
    updateShow,
    deleteShow,
    decreaseAvailableSeats,
    increaseAvailableSeats
};