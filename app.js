const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

// ================= ROUTES =================

const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const showRoutes = require("./routes/showRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const cinemaRoutes = require("./routes/cinemaRoutes");

// ================= ERROR HANDLER =================

const errorHandler = require("./middleware/errorHandler");

// ================= APP =================

const app = express();

// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());

// ================= FRONTEND =================

const frontendPath = path.join(__dirname, "FRONTEND");

console.log("Frontend path:", frontendPath);

// Serve frontend files
app.use(express.static(frontendPath));

// ================= IMAGE TEST =================

app.get("/test-image", (req, res) => {

    const imagePath =
        path.join(
            frontendPath,
            "images",
            "inception.jpg"
        );

    console.log("Image path:", imagePath);

    res.sendFile(imagePath, (err) => {

        if (err) {

            console.error(
                "Image error:",
                err
            );

            if (!res.headersSent) {
                res.status(404).send(
                    "Image not found"
                );
            }

        }

    });

});

// ================= HOME =================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            frontendPath,
            "index.html"
        )
    );

});

// ================= AUTH =================

app.use(
    "/api/auth",
    authRoutes
);

// ================= MOVIES =================

app.use(
    "/api/movies",
    movieRoutes
);

// ================= SHOWS =================

app.use(
    "/api/shows",
    showRoutes
);

// ================= BOOKINGS =================

app.use(
    "/api/bookings",
    bookingRoutes
);

// ================= CINEMAS =================

app.use(
    "/api/cinemas",
    cinemaRoutes
);

// ================= ERROR HANDLER =================

app.use(errorHandler);

// ================= SERVER =================

const PORT =
    process.env.PORT || 3000;

app.listen(
    PORT,
    () => {

        console.log(
            `Server is running on port ${PORT}`
        );

        console.log(
            `Frontend: http://localhost:${PORT}`
        );

        console.log(
            `Image test: http://localhost:${PORT}/test-image`
        );

    }
);