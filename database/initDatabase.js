const db = require("../config/database");
const bcrypt = require("bcryptjs");

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

console.log("Users table is ready");


// =====================================================
// INSERT USERS
// =====================================================

const insertUser = db.prepare(`
    INSERT INTO users
    (
        name,
        email,
        password,
        role,
        phone
    )
    VALUES (?, ?, ?, ?, ?)
`);


// =====================================================
// HASH PASSWORDS
// =====================================================

const adminPassword =
    bcrypt.hashSync("Admin123", 10);

const mostafaPassword =
    bcrypt.hashSync("Mostafa123", 10);

const ahmedPassword =
    bcrypt.hashSync("Ahmed123", 10);

const omarPassword =
    bcrypt.hashSync("Omar123", 10);

const mariamPassword =
    bcrypt.hashSync("Mariam123", 10);


// =====================================================
// USERS DATA
// =====================================================

const users = [

    [
        "Admin User",
        "admin@example.com",
        adminPassword,
        "admin",
        "01000000000"
    ],

    [
        "Mostafa Nassef",
        "mostafa@example.com",
        mostafaPassword,
        "customer",
        "01111111111"
    ],

    [
        "Ahmed Ali",
        "ahmed@example.com",
        ahmedPassword,
        "customer",
        "01222222222"
    ],

    [
        "Omar Hassan",
        "omar@example.com",
        omarPassword,
        "customer",
        "01033333333"
    ],

    [
        "Mariam Mohamed",
        "mariam@example.com",
        mariamPassword,
        "customer",
        "01144444444"
    ]

];


// =====================================================
// INSERT USERS
// =====================================================

for (const user of users) {

    insertUser.run(...user);

}


// =====================================================
// GET INSERTED USERS
// =====================================================

const userRows = db
    .prepare(`
        SELECT
            id,
            name,
            email,
            role,
            phone
        FROM users
        ORDER BY id
    `)
    .all();


console.log("Users inserted:");
console.log(userRows);


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

console.log("Movies table is ready");


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

console.log("Cinemas table is ready");


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

console.log("Shows table is ready");


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
// CREATE BOOKINGS TABLE
// =====================================================

db.exec(`
    CREATE TABLE bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        customer_name TEXT NOT NULL,

        customer_email TEXT NOT NULL,

        user_id INTEGER NOT NULL,

        show_id INTEGER NOT NULL,

        seats_booked INTEGER NOT NULL,

        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,

        FOREIGN KEY (show_id)
            REFERENCES shows(id)
            ON DELETE CASCADE
    );
`);

console.log("Bookings table is ready");


// =====================================================
// INSERT BOOKINGS
// =====================================================

const insertBooking = db.prepare(`
    INSERT INTO bookings
    (
        customer_name,
        customer_email,
        user_id,
        show_id,
        seats_booked
    )
    VALUES (?, ?, ?, ?, ?)
`);


const bookings = [

    [
        "Mostafa Nassef",
        "mostafa@example.com",
        userRows[1].id,
        showRows[0].id,
        2
    ],

    [
        "Ahmed Ali",
        "ahmed@example.com",
        userRows[2].id,
        showRows[1].id,
        3
    ],

    [
        "Omar Hassan",
        "omar@example.com",
        userRows[3].id,
        showRows[2].id,
        2
    ],

    [
        "Mariam Mohamed",
        "mariam@example.com",
        userRows[4].id,
        showRows[3].id,
        4
    ]

];


for (const booking of bookings) {

    insertBooking.run(...booking);

}


// =====================================================
// GET INSERTED BOOKINGS
// =====================================================

const bookingRows = db
    .prepare(`
        SELECT
            id,
            customer_name,
            customer_email,
            user_id,
            show_id,
            seats_booked
        FROM bookings
        ORDER BY id
    `)
    .all();


console.log("Bookings inserted:");
console.log(bookingRows);


// =====================================================
// FINAL RESULT
// =====================================================

console.log("");

console.log("======================================");
console.log("Database initialized successfully!");
console.log("======================================");

console.log("Users: 5");
console.log("Movies: 4");
console.log("Cinemas: 3");
console.log("Shows: 5");
console.log("Bookings: 4");

console.log("======================================");


// =====================================================
// CLOSE DATABASE
// =====================================================

db.close();