const db = require("../config/database");

// ================= GET ALL MOVIES =================

const getAllMovies = () => {
    return db
        .prepare(`
            SELECT *
            FROM movies
            ORDER BY id DESC
        `)
        .all();
};

// ================= GET MOVIE BY ID =================

const getMovieById = (id) => {
    return db
        .prepare(`
            SELECT *
            FROM movies
            WHERE id = ?
        `)
        .get(id);
};

// ================= CREATE MOVIE =================

const createMovie = (movie) => {

    const {
        title,
        description,
        genre,
        duration,
        release_date,
        rating,
        poster
    } = movie;

    return db
        .prepare(`
            INSERT INTO movies
            (
                title,
                description,
                genre,
                duration,
                release_date,
                rating,
                poster
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
        .run(
            title,
            description,
            genre,
            duration,
            release_date,
            rating,
            poster
        );
};

// ================= UPDATE MOVIE =================

const updateMovie = (id, movie) => {

    const {
        title,
        description,
        genre,
        duration,
        release_date,
        rating,
        poster
    } = movie;

    return db
        .prepare(`
            UPDATE movies
            SET
                title = ?,
                description = ?,
                genre = ?,
                duration = ?,
                release_date = ?,
                rating = ?,
                poster = ?
            WHERE id = ?
        `)
        .run(
            title,
            description,
            genre,
            duration,
            release_date,
            rating,
            poster,
            id
        );
};

// ================= DELETE MOVIE =================

const deleteMovie = (id) => {

    return db
        .prepare(`
            DELETE FROM movies
            WHERE id = ?
        `)
        .run(id);
};

// ================= EXPORT =================

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};