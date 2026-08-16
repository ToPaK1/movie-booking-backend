const express = require("express");
const router = express.Router();

const showController = require("../controllers/showController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", showController.getAllShows);

router.get("/:id", showController.getShowById);

router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    showController.createShow
);

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    showController.updateShow
);

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    showController.deleteShow
);

module.exports = router;