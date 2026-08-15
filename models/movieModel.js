const db = require("../config/database");

const getAllMovies = () => {
    return db.prepare("SELECT * FROM movies").all();
};

const getMovieById = (id) => {
    return db.prepare("SELECT * FROM movies WHERE id = ?").get(id);
};

const createMovie = (movie) => {
    const sql = `
        INSERT INTO movies
        (title, description, genre, duration, release_date, rating)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = db.prepare(sql).run(
        movie.title,
        movie.description,
        movie.genre,
        movie.duration,
        movie.release_date,
        movie.rating
    );

    return result;
};

const updateMovie = (id, movie) => {
    const sql = `
        UPDATE movies
        SET title = ?,
            description = ?,
            genre = ?,
            duration = ?,
            release_date = ?,
            rating = ?
        WHERE id = ?
    `;

    return db.prepare(sql).run(
        movie.title,
        movie.description,
        movie.genre,
        movie.duration,
        movie.release_date,
        movie.rating,
        id
    );
};

const deleteMovie = (id) => {
    return db.prepare("DELETE FROM movies WHERE id = ?").run(id);
};

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};