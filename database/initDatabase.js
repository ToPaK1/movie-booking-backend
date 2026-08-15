const db = require("../config/database");

// Enable foreign keys
db.pragma("foreign_keys = ON");

// =========================
// DROP OLD TABLES
// =========================

db.exec(`
    DROP TABLE IF EXISTS bookings;
    DROP TABLE IF EXISTS shows;
    DROP TABLE IF EXISTS cinemas;
    DROP TABLE IF EXISTS movies;
`);

// =========================
// CREATE MOVIES TABLE
// =========================

db.exec(`
    CREATE TABLE movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        genre TEXT NOT NULL,
        duration INTEGER NOT NULL,
        release_date TEXT,
        rating REAL
    );
`);

// =========================
// CREATE CINEMAS TABLE
// =========================

db.exec(`
    CREATE TABLE cinemas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        total_seats INTEGER NOT NULL
    );
`);

// =========================
// CREATE SHOWS TABLE
// =========================

db.exec(`
    CREATE TABLE shows (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movie_id INTEGER NOT NULL,
        cinema_id INTEGER NOT NULL,
        show_date TEXT NOT NULL,
        show_time TEXT NOT NULL,
        available_seats INTEGER NOT NULL,

        FOREIGN KEY (movie_id)
            REFERENCES movies(id)
            ON DELETE CASCADE,

        FOREIGN KEY (cinema_id)
            REFERENCES cinemas(id)
            ON DELETE CASCADE
    );
`);

// =========================
// CREATE BOOKINGS TABLE
// =========================

db.exec(`
    CREATE TABLE bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        show_id INTEGER NOT NULL,
        seats_booked INTEGER NOT NULL,

        FOREIGN KEY (show_id)
            REFERENCES shows(id)
            ON DELETE CASCADE
    );
`);

// =========================
// INSERT MOVIES
// =========================

const insertMovie = db.prepare(`
    INSERT INTO movies
    (title, description, genre, duration, release_date, rating)
    VALUES (?, ?, ?, ?, ?, ?)
`);

const movies = [
    [
        "Inception",
        "A thief who enters the dreams of others to steal secrets.",
        "Sci-Fi",
        148,
        "2010-07-16",
        8.8
    ],
    [
        "The Dark Knight",
        "Batman faces the Joker in Gotham City.",
        "Action",
        152,
        "2008-07-18",
        9.0
    ],
    [
        "Interstellar",
        "Explorers travel through a wormhole in space.",
        "Sci-Fi",
        169,
        "2014-11-07",
        8.7
    ],
    [
        "The Godfather",
        "The story of a powerful Italian-American crime family.",
        "Crime",
        175,
        "1972-03-24",
        9.2
    ]
];

for (const movie of movies) {
    insertMovie.run(...movie);
}

// =========================
// INSERT CINEMAS
// =========================

const insertCinema = db.prepare(`
    INSERT INTO cinemas
    (name, location, total_seats)
    VALUES (?, ?, ?)
`);

const cinemas = [
    ["Galaxy Cinema", "Cairo", 200],
    ["City Stars Cinema", "Nasr City", 250],
    ["Plaza Cinema", "Giza", 180]
];

for (const cinema of cinemas) {
    insertCinema.run(...cinema);
}

// =========================
// INSERT SHOWS
// =========================

const insertShow = db.prepare(`
    INSERT INTO shows
    (movie_id, cinema_id, show_date, show_time, available_seats)
    VALUES (?, ?, ?, ?, ?)
`);

const shows = [
    [1, 1, "2026-08-20", "18:00", 150],
    [2, 1, "2026-08-20", "21:00", 120],
    [3, 2, "2026-08-21", "17:30", 200],
    [4, 2, "2026-08-21", "20:30", 180],
    [1, 3, "2026-08-22", "19:00", 130]
];

for (const show of shows) {
    insertShow.run(...show);
}

// =========================
// INSERT BOOKINGS
// =========================

const insertBooking = db.prepare(`
    INSERT INTO bookings
    (customer_name, customer_email, show_id, seats_booked)
    VALUES (?, ?, ?, ?)
`);

const bookings = [
    ["Mostafa Nassef", "mostafa@example.com", 1, 2],
    ["Ahmed Ali", "ahmed@example.com", 2, 3],
    ["Omar Hassan", "omar@example.com", 3, 2],
    ["Mariam Mohamed", "mariam@example.com", 4, 4]
];

for (const booking of bookings) {
    insertBooking.run(...booking);
}

console.log("Database initialized successfully!");
console.log("Movies: 4");
console.log("Cinemas: 3");
console.log("Shows: 5");
console.log("Bookings: 4");