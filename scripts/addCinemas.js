const db = require("../config/database");

const addCinemas = () => {
    try {
        const columns = db.prepare("PRAGMA table_info(cinemas)").all();
        const columnNames = new Set(columns.map(column => column.name));

        if (!columnNames.has("address")) {
            db.exec("ALTER TABLE cinemas ADD COLUMN address TEXT");
        }

        if (!columnNames.has("status")) {
            db.exec("ALTER TABLE cinemas ADD COLUMN status TEXT NOT NULL DEFAULT 'active'");
        }

        db.prepare("UPDATE cinemas SET address = location WHERE address IS NULL OR address = ''").run();
        db.prepare("UPDATE cinemas SET status = 'active' WHERE status IS NULL OR status = ''").run();

        const targetCinemas = [
            ["Cinema 4", "New Cairo", "New Cairo, Cairo", 220, "active"],
            ["Cinema 5", "6th of October", "6th of October City, Giza", 200, "active"],
            ["Cinema 6", "Sheikh Zayed", "Sheikh Zayed City, Giza", 200, "locked"]
        ];

        const insert = db.prepare(`
            INSERT INTO cinemas (name, location, address, total_seats, status)
            VALUES (?, ?, ?, ?, ?)
        `);

        let count = db.prepare("SELECT COUNT(*) AS count FROM cinemas").get().count;

        for (const cinema of targetCinemas) {
            if (count >= 6) break;

            const exists = db.prepare("SELECT id FROM cinemas WHERE name = ?").get(cinema[0]);
            if (!exists) {
                insert.run(...cinema);
                count++;
            }
        }

        // The sixth cinema is always the temporary locked venue.
        if (count >= 6) {
            db.prepare("UPDATE cinemas SET status = 'active' WHERE id < (SELECT MAX(id) FROM cinemas)").run();
            db.prepare("UPDATE cinemas SET status = 'locked' WHERE id = (SELECT MAX(id) FROM cinemas)").run();
        }

        const all = db.prepare("SELECT id, name, status FROM cinemas ORDER BY id").all();
        console.log("Cinemas are ready:");
        console.table(all);
        console.log("Target: 5 active cinemas + Cinema 6 temporarily locked");
    } catch (error) {
        console.error("Error adding cinemas:", error.message);
    }
};

addCinemas();
