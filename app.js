const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");

require("dotenv").config();


// =====================================================
// LOGIN RATE LIMITER
// =====================================================

const loginLimiter = rateLimit({

    // 15 minutes
    windowMs: 15 * 60 * 1000,

    // Maximum 5 requests
    max: 5,

    message: {
        message:
            "Too many login attempts. Please try again later."
    },

    // Return rate limit info in RateLimit-* headers
    standardHeaders: true,

    // Disable old X-RateLimit-* headers
    legacyHeaders: false

});


// =====================================================
// ROUTES
// =====================================================

const authRoutes =
    require("./routes/authRoutes");

const movieRoutes =
    require("./routes/movieRoutes");

const showRoutes =
    require("./routes/showRoutes");

const bookingRoutes =
    require("./routes/bookingRoutes");

const cinemaRoutes =
    require("./routes/cinemaRoutes");


// =====================================================
// ERROR HANDLER
// =====================================================

const errorHandler =
    require("./middleware/errorHandler");


// =====================================================
// APP
// =====================================================

const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());


// =====================================================
// FRONTEND
// =====================================================

const frontendPath =
    path.join(__dirname, "FRONTEND");

console.log(
    "Frontend path:",
    frontendPath
);


// Serve frontend files
app.use(
    express.static(frontendPath)
);


// =====================================================
// IMAGE TEST
// =====================================================

app.get(
    "/test-image",
    (req, res) => {

        const imagePath =
            path.join(
                frontendPath,
                "images",
                "inception.jpg"
            );

        console.log(
            "Image path:",
            imagePath
        );

        res.sendFile(
            imagePath,
            (err) => {

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

            }
        );

    }
);


// =====================================================
// HOME
// =====================================================

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                frontendPath,
                "index.html"
            )
        );

    }
);


// =====================================================
// AUTH
// =====================================================

// Rate limiter applies ONLY to:
// POST /api/auth/login

app.use(
    "/api/auth/login",
    loginLimiter
);


// All authentication routes
app.use(
    "/api/auth",
    authRoutes
);


// =====================================================
// MOVIES
// =====================================================

app.use(
    "/api/movies",
    movieRoutes
);


// =====================================================
// SHOWS
// =====================================================

app.use(
    "/api/shows",
    showRoutes
);


// =====================================================
// BOOKINGS
// =====================================================

app.use(
    "/api/bookings",
    bookingRoutes
);


// =====================================================
// CINEMAS
// =====================================================

app.use(
    "/api/cinemas",
    cinemaRoutes
);


// =====================================================
// ERROR HANDLER
// =====================================================

app.use(errorHandler);


// =====================================================
// SERVER
// =====================================================

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