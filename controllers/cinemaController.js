const cinemaModel = require("../models/cinemaModel");

const getAllCinemas = (req, res) => {
    try {
        const cinemas = cinemaModel.getAllCinemas();

        res.status(200).json(cinemas);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching cinemas",
            error: error.message
        });
    }
};

const getCinemaById = (req, res) => {
    try {
        const id = req.params.id;
        const cinema = cinemaModel.getCinemaById(id);

        if (!cinema) {
            return res.status(404).json({
                message: "Cinema not found"
            });
        }

        res.status(200).json(cinema);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching cinema",
            error: error.message
        });
    }
};

const createCinema = (req, res) => {
    try {
        const cinema = req.body;

        const result = cinemaModel.createCinema(cinema);

        res.status(201).json({
            message: "Cinema created successfully",
            cinemaId: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating cinema",
            error: error.message
        });
    }
};

const updateCinema = (req, res) => {
    try {
        const id = req.params.id;
        const cinema = req.body;

        const result = cinemaModel.updateCinema(id, cinema);

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Cinema not found"
            });
        }

        res.status(200).json({
            message: "Cinema updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating cinema",
            error: error.message
        });
    }
};

const deleteCinema = (req, res) => {
    try {
        const id = req.params.id;

        const result = cinemaModel.deleteCinema(id);

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Cinema not found"
            });
        }

        res.status(200).json({
            message: "Cinema deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting cinema",
            error: error.message
        });
    }
};

module.exports = {
    getAllCinemas,
    getCinemaById,
    createCinema,
    updateCinema,
    deleteCinema
};