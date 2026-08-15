const movieModel = require("../models/movieModel");

const getAllMovies = (req, res, next) => {
    try {
        const movies = movieModel.getAllMovies();

        res.status(200).json(movies);
    } catch (err) {
        next(err);
    }
};

const getMovieById = (req, res, next) => {
    try {
        const movie = movieModel.getMovieById(req.params.id);

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json(movie);
    } catch (err) {
        next(err);
    }
};

const createMovie = (req, res, next) => {
    try {
        const result = movieModel.createMovie(req.body);

        res.status(201).json({
            message: "Movie created successfully",
            movieId: result.lastInsertRowid
        });
    } catch (err) {
        next(err);
    }
};

const updateMovie = (req, res, next) => {
    try {
        const result = movieModel.updateMovie(req.params.id, req.body);

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json({
            message: "Movie updated successfully"
        });
    } catch (err) {
        next(err);
    }
};

const deleteMovie = (req, res, next) => {
    try {
        const result = movieModel.deleteMovie(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json({
            message: "Movie deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};