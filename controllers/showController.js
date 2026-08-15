const showModel = require("../models/showModel");

const getAllShows = (req, res, next) => {
    try {
        const shows = showModel.getAllShows();

        res.status(200).json(shows);
    } catch (err) {
        next(err);
    }
};

const getShowById = (req, res, next) => {
    try {
        const show = showModel.getShowById(req.params.id);

        if (!show) {
            return res.status(404).json({
                message: "Show not found"
            });
        }

        res.status(200).json(show);
    } catch (err) {
        next(err);
    }
};

const createShow = (req, res, next) => {
    try {
        const result = showModel.createShow(req.body);

        res.status(201).json({
            message: "Show created successfully",
            showId: result.lastInsertRowid
        });
    } catch (err) {
        next(err);
    }
};

const updateShow = (req, res, next) => {
    try {
        const result = showModel.updateShow(
            req.params.id,
            req.body
        );

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Show not found"
            });
        }

        res.status(200).json({
            message: "Show updated successfully"
        });
    } catch (err) {
        next(err);
    }
};

const deleteShow = (req, res, next) => {
    try {
        const result = showModel.deleteShow(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Show not found"
            });
        }

        res.status(200).json({
            message: "Show deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllShows,
    getShowById,
    createShow,
    updateShow,
    deleteShow
};