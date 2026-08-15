const express = require("express");
const cors = require("cors");
require("dotenv").config();

const movieRoutes = require("./routes/movieRoutes");
const showRoutes = require("./routes/showRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const cinemaRoutes = require("./routes/cinemaRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Movie Booking API is running"
    });
});

app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cinemas", cinemaRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});