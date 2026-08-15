const db = require("../config/database");

const getAllShows = () => {
    return db.prepare("SELECT * FROM shows").all();
};

const getShowById = (id) => {
    return db.prepare("SELECT * FROM shows WHERE id = ?").get(id);
};

const createShow = (show) => {
    const sql = `
        INSERT INTO shows
        (movie_id, cinema_id, show_date, show_time, available_seats)
        VALUES (?, ?, ?, ?, ?)
    `;

    return db.prepare(sql).run(
        show.movie_id,
        show.cinema_id,
        show.show_date,
        show.show_time,
        show.available_seats
    );
};

const updateShow = (id, show) => {
    const sql = `
        UPDATE shows
        SET movie_id = ?,
            cinema_id = ?,
            show_date = ?,
            show_time = ?,
            available_seats = ?
        WHERE id = ?
    `;

    return db.prepare(sql).run(
        show.movie_id,
        show.cinema_id,
        show.show_date,
        show.show_time,
        show.available_seats,
        id
    );
};

const deleteShow = (id) => {
    return db.prepare("DELETE FROM shows WHERE id = ?").run(id);
};

module.exports = {
    getAllShows,
    getShowById,
    createShow,
    updateShow,
    deleteShow
};