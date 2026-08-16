const express = require("express");
const router = express.Router();

const cinemaController = require("../controllers/cinemaController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", cinemaController.getAllCinemas);

router.get("/:id", cinemaController.getCinemaById);

router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    cinemaController.createCinema
);

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    cinemaController.updateCinema
);

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    cinemaController.deleteCinema
);

module.exports = router;