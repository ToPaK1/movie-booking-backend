const express = require("express");
const cors = require("cors");
require("dotenv").config();


// ================= ROUTES =================

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


// ================= MIDDLEWARE =================

const errorHandler =
    require("./middleware/errorHandler");


// ================= APP =================

const app = express();


// Enable CORS
app.use(cors());


// Read JSON request bodies
app.use(express.json());


// ================= HOME =================

app.get("/", (req, res) => {

    res.status(200).json({

        message:
            "Movie Booking API is running",

        status:
            "success"

    });

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

    }
);