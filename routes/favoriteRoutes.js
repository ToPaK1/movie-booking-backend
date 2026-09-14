const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const favoriteController = require("../controllers/favoriteController");

router.use(authenticateToken);
router.get("/", favoriteController.getMyFavorites);
router.get("/:movieId", favoriteController.checkFavorite);
router.post("/:movieId/toggle", favoriteController.toggleFavorite);

module.exports = router;
