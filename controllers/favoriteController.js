const favoriteModel = require("../models/favoriteModel");
const movieModel = require("../models/movieModel");

const getMyFavorites = (req, res, next) => {
    try {
        res.status(200).json(favoriteModel.getFavoritesByUser(req.user.id));
    } catch (error) { next(error); }
};

const toggleFavorite = (req, res, next) => {
    try {
        const movieId = Number(req.params.movieId);
        if (!Number.isInteger(movieId) || movieId <= 0) {
            return res.status(400).json({ message: "Invalid movie id" });
        }
        if (!movieModel.getMovieById(movieId)) {
            return res.status(404).json({ message: "Movie not found" });
        }

        if (favoriteModel.isFavorite(req.user.id, movieId)) {
            favoriteModel.removeFavorite(req.user.id, movieId);
            return res.status(200).json({ favorite: false, message: "Removed from favorites" });
        }

        favoriteModel.addFavorite(req.user.id, movieId);
        return res.status(201).json({ favorite: true, message: "Added to favorites" });
    } catch (error) { next(error); }
};

const checkFavorite = (req, res, next) => {
    try {
        const movieId = Number(req.params.movieId);
        res.status(200).json({ favorite: favoriteModel.isFavorite(req.user.id, movieId) });
    } catch (error) { next(error); }
};

module.exports = { getMyFavorites, toggleFavorite, checkFavorite };
