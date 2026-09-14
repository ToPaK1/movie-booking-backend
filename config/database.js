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

const tableExists = (table) => {
    return Boolean(
        db.prepare(
            "SELECT name FROM sqlite_master WHERE type='table' AND name = ?"
        ).get(table)
    );
};

const addColumnIfMissing = (table, column, definition) => {
    if (!tableExists(table)) {
        return;
    }

    const columns = db.prepare(`PRAGMA table_info(${table})`).all();

    if (!columns.some((item) => item.name === column)) {
        db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`).run();
        console.log(`Added ${table}.${column}`);
    }
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
                (SELECT ticket_price FROM shows WHERE shows.id = bookings.show_id),
                120
            ),
            total_price = seats_booked * COALESCE(
                (SELECT ticket_price FROM shows WHERE shows.id = bookings.show_id),
                120
            )
            WHERE total_price = 0
        `).run();
    }
} catch (error) {
    console.log("Database migration note:", error.message);
}

module.exports = db;
