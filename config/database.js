const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "../data/movie_booking.db");

const db = new Database(dbPath);

console.log("SQLite database connected successfully");

// Create users table
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

// Add user_id to bookings table if it doesn't exist
const bookingColumns = db
    .prepare("PRAGMA table_info(bookings)")
    .all();

const hasUserId = bookingColumns.some(
    column => column.name === "user_id"
);

if (!hasUserId) {
    db.prepare(
        "ALTER TABLE bookings ADD COLUMN user_id INTEGER"
    ).run();

    console.log("user_id column added to bookings");
}

module.exports = db;