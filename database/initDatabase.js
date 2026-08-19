const db = require("../config/database");

// =====================================================
// ENABLE FOREIGN KEYS
// =====================================================

db.pragma("foreign_keys = ON");


// =====================================================
// DROP OLD TABLES
// =====================================================

db.exec(`
    DROP TABLE IF EXISTS bookings;
    DROP TABLE IF EXISTS shows;
    DROP TABLE IF EXISTS cinemas;
    DROP TABLE IF EXISTS movies;
    DROP TABLE IF EXISTS users;
`);


// =====================================================
// CREATE USERS TABLE
// =====================================================

db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        email TEXT NOT NULL UNIQUE,

        password TEXT NOT NULL,

        role TEXT NOT NULL DEFAULT 'customer',

        phone TEXT
    );
`);


// =====================================================
// CREATE MOVIES TABLE
// =====================================================

db.exec(`
    CREATE TABLE movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        title TEXT NOT NULL,

        description TEXT,

        genre TEXT NOT NULL,

        duration INTEGER NOT NULL,

        release_date TEXT,

        rating REAL,

        poster TEXT
    );
`);


// =====================================================
// CREATE CINEMAS TABLE
// =====================================================

db.exec(`
    CREATE TABLE cinemas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        location TEXT NOT NULL,

        total_seats INTEGER NOT NULL
    );
`);


// =====================================================
// CREATE SHOWS TABLE
// =====================================================

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


// =====================================================
// CREATE BOOKINGS TABLE
// =====================================================

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


// =====================================================
// INSERT MOVIES
// =====================================================

const insertMovie = db.prepare(`
    INSERT INTO movies
    (
        title,
        description,
        genre,
        duration,
        release_date,
        rating,
        poster
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);


const movies = [

    [
        "Inception",
        "A thief who enters the dreams of others to steal secrets.",
        "Sci-Fi",
        148,
        "2010-07-16",
        8.8,
        "/images/inception.jpg"
    ],

    [
        "The Dark Knight",
        "Batman faces the Joker in Gotham City.",
        "Action",
        152,
        "2008-07-18",
        9.0,
        "/images/dark-knight.jpg"
    ],

    [
        "Interstellar",
        "Explorers travel through a wormhole in space.",
        "Sci-Fi",
        169,
        "2014-11-07",
        8.7,
        "/images/interstellar.jpg"
    ],

    [
        "The Godfather",
        "The story of a powerful Italian-American crime family.",
        "Crime",
        175,
        "1972-03-24",
        9.2,
        "/images/godfather.jpg"
    ]

];


for (const movie of movies) {

    insertMovie.run(...movie);

}


// =====================================================
// GET INSERTED MOVIES
// =====================================================

const movieRows = db
    .prepare(`
        SELECT
            id,
            title
        FROM movies
        ORDER BY id
    `)
    .all();


console.log("Movies inserted:");
console.log(movieRows);


// =====================================================
// INSERT CINEMAS
// =====================================================

const insertCinema = db.prepare(`
    INSERT INTO cinemas
    (
        name,
        location,
        total_seats
    )
    VALUES (?, ?, ?)
`);


const cinemas = [

    [
        "Galaxy Cinema",
        "Cairo",
        200
    ],

    [
        "City Stars Cinema",
        "Nasr City",
        250
    ],

    [
        "Plaza Cinema",
        "Giza",
        180
    ]

];


for (const cinema of cinemas) {

    insertCinema.run(...cinema);

}


// =====================================================
// GET INSERTED CINEMAS
// =====================================================

const cinemaRows = db
    .prepare(`
        SELECT
            id,
            name
        FROM cinemas
        ORDER BY id
    `)
    .all();


console.log("Cinemas inserted:");
console.log(cinemaRows);


// =====================================================
// INSERT SHOWS
// =====================================================

const insertShow = db.prepare(`
    INSERT INTO shows
    (
        movie_id,
        cinema_id,
        show_date,
        show_time,
        available_seats
    )
    VALUES (?, ?, ?, ?, ?)
`);


const shows = [

    [
        movieRows[0].id,
        cinemaRows[0].id,
        "2026-08-20",
        "18:00",
        150
    ],

    [
        movieRows[1].id,
        cinemaRows[0].id,
        "2026-08-20",
        "21:00",
        120
    ],

    [
        movieRows[2].id,
        cinemaRows[1].id,
        "2026-08-21",
        "17:30",
        200
    ],

    [
        movieRows[3].id,
        cinemaRows[1].id,
        "2026-08-21",
        "20:30",
        180
    ],

    [
        movieRows[0].id,
        cinemaRows[2].id,
        "2026-08-22",
        "19:00",
        130
    ]

];


for (const show of shows) {

    insertShow.run(...show);

}


// =====================================================
// GET INSERTED SHOWS
// =====================================================

const showRows = db
    .prepare(`
        SELECT
            id,
            movie_id,
            cinema_id,
            show_date,
            show_time
        FROM shows
        ORDER BY id
    `)
    .all();


console.log("Shows inserted:");
console.log(showRows);


// =====================================================
// INSERT BOOKINGS
// =====================================================

const insertBooking = db.prepare(`
    INSERT INTO bookings
    (
        customer_name,
        customer_email,
        show_id,
        seats_booked
    )
    VALUES (?, ?, ?, ?)
`);


const bookings = [

    [
        "Mostafa Nassef",
        "mostafa@example.com",
        showRows[0].id,
        2
    ],

    [
        "Ahmed Ali",
        "ahmed@example.com",
        showRows[1].id,
        3
    ],

    [
        "Omar Hassan",
        "omar@example.com",
        showRows[2].id,
        2
    ],

    [
        "Mariam Mohamed",
        "mariam@example.com",
        showRows[3].id,
        4
    ]

];


for (const booking of bookings) {

    insertBooking.run(...booking);

}


// =====================================================
// FINAL RESULT
// =====================================================

console.log("");

console.log("======================================");
console.log("Database initialized successfully!");
console.log("======================================");

console.log("Users table: READY");
console.log("Movies: 4");
console.log("Cinemas: 3");
console.log("Shows: 5");
console.log("Bookings: 4");

console.log("======================================");