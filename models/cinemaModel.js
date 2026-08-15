const db = require("../config/database");

const getAllCinemas = () => {
    return db.prepare("SELECT * FROM cinemas").all();
};

const getCinemaById = (id) => {
    return db.prepare(
        "SELECT * FROM cinemas WHERE id = ?"
    ).get(id);
};

const createCinema = (cinema) => {
    const sql = `
        INSERT INTO cinemas
        (name, location, total_seats)
        VALUES (?, ?, ?)
    `;

    return db.prepare(sql).run(
        cinema.name,
        cinema.location,
        cinema.total_seats
    );
};

const updateCinema = (id, cinema) => {
    const sql = `
        UPDATE cinemas
        SET name = ?,
            location = ?,
            total_seats = ?
        WHERE id = ?
    `;

    return db.prepare(sql).run(
        cinema.name,
        cinema.location,
        cinema.total_seats,
        id
    );
};

const deleteCinema = (id) => {
    return db.prepare(
        "DELETE FROM cinemas WHERE id = ?"
    ).run(id);
};

module.exports = {
    getAllCinemas,
    getCinemaById,
    createCinema,
    updateCinema,
    deleteCinema
};