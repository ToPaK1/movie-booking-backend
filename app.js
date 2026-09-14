const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be configured and contain at least 32 characters.");
}

const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://localhost:4200"
]);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: "Too many authentication attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false
});

const generalApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: { message: "Too many requests. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path.startsWith("/auth")
});

const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const showRoutes = require("./routes/showRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const cinemaRoutes = require("./routes/cinemaRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.disable("x-powered-by");

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) return callback(null, true);
        return callback(new Error("Origin is not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    maxAge: 600
}));

app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
});

app.use(express.json({ limit: "1mb", strict: true }));
app.use("/api", generalApiLimiter);

const frontendPath = path.join(__dirname, "FRONTEND");
app.use(express.static(frontendPath, {
    etag: true,
    maxAge: "1h",
    dotfiles: "deny"
}));

app.get("/", (req, res) => res.sendFile(path.join(frontendPath, "index.html")));

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);
app.use("/api/auth/verify-email", authLimiter);
app.use("/api/auth/resend-verification", authLimiter);
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
