const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: "Too many login attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false
});

const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const showRoutes = require("./routes/showRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const cinemaRoutes = require("./routes/cinemaRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const frontendPath = path.join(__dirname, "FRONTEND");
app.use(express.static(frontendPath));

app.get("/", (req, res) => res.sendFile(path.join(frontendPath, "index.html")));

app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cinemas", cinemaRoutes);
app.use("/api/favorites", favoriteRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);
});
