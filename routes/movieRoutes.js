const express = require("express");
const router = express.Router();

const movieController = require("../controllers/movieController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", movieController.getAllMovies);

router.get("/:id", movieController.getMovieById);

router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    movieController.createMovie
);

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    movieController.updateMovie
);

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    movieController.deleteMovie
);

module.exports = router;