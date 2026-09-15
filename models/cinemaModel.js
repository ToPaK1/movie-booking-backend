const db = require("../config/database");

const getAllCinemas = () => {
    return db.prepare("SELECT * FROM cinemas ORDER BY id").all();
};

const getCinemaById = (id) => {
    return db.prepare("SELECT * FROM cinemas WHERE id = ?").get(id);
};

const createCinema = (cinema) => {
    const sql = `
        INSERT INTO cinemas
        (name, location, address, total_seats, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    return db.prepare(sql).run(
        cinema.name,
        cinema.location,
        cinema.address || cinema.location,
        cinema.total_seats,
        cinema.status || "active"
    );
};

const updateCinema = (id, cinema) => {
    const sql = `
        UPDATE cinemas
        SET name = ?,
            location = ?,
            address = ?,
            total_seats = ?,
            status = ?
        WHERE id = ?
    `;

    return db.prepare(sql).run(
        cinema.name,
        cinema.location,
        cinema.address || cinema.location,
        cinema.total_seats,
        cinema.status || "active",
        id
    );
};

const deleteCinema = (id) => {
    return db.prepare("DELETE FROM cinemas WHERE id = ?").run(id);
};

module.exports = {
    getAllCinemas,
    getCinemaById,
    createCinema,
    updateCinema,
    deleteCinema
};
