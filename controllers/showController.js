const showModel = require("../models/showModel");

const enrichShow = (show) => ({
    ...show,
    booked_seats: showModel.getBookedSeats(show.id)
});

const getAllShows = (req, res, next) => {
    try { res.status(200).json(showModel.getAllShows().map(enrichShow)); }
    catch (err) { next(err); }
};

const getShowById = (req, res, next) => {
    try {
        const show = showModel.getShowById(req.params.id);
        if (!show) return res.status(404).json({ message: "Show not found" });
        res.status(200).json(enrichShow(show));
    } catch (err) { next(err); }
};

const createShow = (req, res, next) => {
    try {
        const { movie_id, cinema_id, show_date, show_time, available_seats, ticket_price } = req.body;
        if (!movie_id || !cinema_id || !show_date || !show_time || !available_seats || ticket_price == null) {
            return res.status(400).json({ message: "Movie, cinema, date, time, seats and ticket price are required" });
        }
        if (Number(ticket_price) <= 0) return res.status(400).json({ message: "Ticket price must be greater than 0" });
        const result = showModel.createShow({ movie_id, cinema_id, show_date, show_time, available_seats, ticket_price: Number(ticket_price) });
        res.status(201).json({ message: "Show created successfully", showId: result.lastInsertRowid });
    } catch (err) { next(err); }
};

const updateShow = (req, res, next) => {
    try {
        const result = showModel.updateShow(req.params.id, req.body);
        if (result.changes === 0) return res.status(404).json({ message: "Show not found" });
        res.status(200).json({ message: "Show updated successfully" });
    } catch (err) { next(err); }
};

const deleteShow = (req, res, next) => {
    try {
        const result = showModel.deleteShow(req.params.id);
        if (result.changes === 0) return res.status(404).json({ message: "Show not found" });
        res.status(200).json({ message: "Show deleted successfully" });
    } catch (err) { next(err); }
};

module.exports = { getAllShows, getShowById, createShow, updateShow, deleteShow };