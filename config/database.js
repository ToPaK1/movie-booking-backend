const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "../data/movie_booking.db");
const db = new Database(dbPath);

console.log("SQLite database connected successfully");

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'customer',
        phone TEXT
    )
`).run();

console.log("Users table is ready");

const tableExists = (table) => Boolean(
    db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?").get(table)
);

const addColumnIfMissing = (table, column, definition) => {
    if (!tableExists(table)) return;
    const columns = db.prepare(`PRAGMA table_info(${table})`).all();
    if (!columns.some((item) => item.name === column)) {
        db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`).run();
        console.log(`Added ${table}.${column}`);
    }
};

const datePlus = (days) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
};

try {
    addColumnIfMissing("users", "email_verified", "INTEGER NOT NULL DEFAULT 0");
    addColumnIfMissing("users", "verification_code", "TEXT");
    addColumnIfMissing("users", "verification_code_expires", "TEXT");

    addColumnIfMissing("shows", "ticket_price", "REAL NOT NULL DEFAULT 120");

    addColumnIfMissing("bookings", "selected_seats", "TEXT NOT NULL DEFAULT '[]'");
    addColumnIfMissing("bookings", "ticket_price", "REAL NOT NULL DEFAULT 120");
    addColumnIfMissing("bookings", "total_price", "REAL NOT NULL DEFAULT 0");

    if (tableExists("shows")) {
        db.prepare(`
            UPDATE shows
            SET ticket_price = CASE
                WHEN id = 1 THEN 150
                WHEN id = 2 THEN 170
                WHEN id = 3 THEN 160
                WHEN id = 4 THEN 180
                WHEN id = 5 THEN 140
                ELSE ticket_price
            END
        `).run();
    }

    if (tableExists("bookings") && tableExists("shows")) {
        db.prepare(`
            UPDATE bookings
            SET ticket_price = COALESCE(
                (SELECT ticket_price FROM shows WHERE shows.id = bookings.show_id), 120
            ),
            total_price = seats_booked * COALESCE(
                (SELECT ticket_price FROM shows WHERE shows.id = bookings.show_id), 120
            )
            WHERE total_price = 0
        `).run();
    }

    // ---------------------------------------------------------
    // Keep the catalog alive: add more movies without duplicating
    // them every time the server starts.
    // ---------------------------------------------------------
    if (tableExists("movies")) {
        const insertMovie = db.prepare(`
            INSERT INTO movies
            (title, description, genre, duration, release_date, rating, poster)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        const catalog = [
            ["Dune: Part Two", "Paul Atreides joins Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.", "Sci-Fi", 166, "2024-03-01", 8.6, "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"],
            ["Oppenheimer", "The story of J. Robert Oppenheimer and the creation of the first atomic bomb.", "Drama", 180, "2023-07-21", 8.6, "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"],
            ["Spider-Man: No Way Home", "Peter Parker asks for help after his identity is revealed, opening the door to unexpected villains and heroes.", "Action", 148, "2021-12-17", 8.2, "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg"],
            ["Top Gun: Maverick", "After decades of service, Maverick trains a new generation of elite pilots for a dangerous mission.", "Action", 131, "2022-05-27", 8.3, "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17lj.jpg"],
            ["John Wick: Chapter 4", "John Wick uncovers a path to defeating the High Table, but powerful enemies stand in his way.", "Action", 169, "2023-03-24", 7.6, "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg"],
            ["Inside Out 2", "Riley enters her teenage years as new emotions take over headquarters.", "Animation", 97, "2024-06-14", 7.6, "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg"],
            ["Avatar: The Way of Water", "The Sully family searches for safety among the ocean clans of Pandora.", "Adventure", 192, "2022-12-16", 7.6, "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg"],
            ["The Batman", "Batman investigates a series of murders that exposes corruption in Gotham City.", "Crime", 176, "2022-03-04", 7.8, "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg"]
        ];

        for (const movie of catalog) {
            const exists = db.prepare("SELECT id FROM movies WHERE title = ?").get(movie[0]);
            if (!exists) insertMovie.run(...movie);
        }
    }

    // ---------------------------------------------------------
    // Current/future cinema schedule.
    // Every movie gets real cinema + date + time + price data.
    // Dates are calculated from the server's current date so the
    // demo does not get stuck on old 2026-08 dates.
    // ---------------------------------------------------------
    if (tableExists("shows") && tableExists("movies") && tableExists("cinemas")) {
        const movies = db.prepare("SELECT id, title FROM movies ORDER BY id").all();
        const cinemas = db.prepare("SELECT id FROM cinemas ORDER BY id").all();
        const insertShow = db.prepare(`
            INSERT INTO shows
            (movie_id, cinema_id, show_date, show_time, available_seats, ticket_price)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const slots = ["14:00", "17:00", "20:00", "22:30"];
        const prices = [150, 170, 160, 180, 140];

        movies.forEach((movie, index) => {
            const futureShow = db.prepare(`
                SELECT id FROM shows
                WHERE movie_id = ? AND show_date >= ?
                LIMIT 1
            `).get(movie.id, datePlus(0));

            if (futureShow) return;

            const firstCinema = cinemas[index % cinemas.length].id;
            const secondCinema = cinemas[(index + 1) % cinemas.length].id;
            const price = prices[index % prices.length];

            insertShow.run(movie.id, firstCinema, datePlus(index % 3), slots[index % slots.length], 150, price);
            insertShow.run(movie.id, secondCinema, datePlus((index + 1) % 5), slots[(index + 1) % slots.length], 150, price + 20);
        });
    }
} catch (error) {
    console.log("Database migration note:", error.message);
}

module.exports = db;
