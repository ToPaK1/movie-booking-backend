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

        const insert = db.prepare(`
            INSERT INTO cinemas (name, location, address, total_seats, status)
            VALUES (?, ?, ?, ?, ?)
        `);

        const cinemas = [
            ["Grand Cinema", "New Cairo", "New Cairo, Cairo", 220, "active"],
            ["Royal Cinema", "6th of October", "6th of October City, Giza", 200, "active"],
            ["Nile Cinema", "Downtown Cairo", "Downtown Cairo, Cairo", 180, "active"],
            ["Elite Cinema", "Maadi", "Maadi, Cairo", 210, "active"],
            ["Vista Cinema", "Dokki", "Dokki, Giza", 190, "active"],
            ["Coming Soon Cinema", "Sheikh Zayed", "Sheikh Zayed City, Giza", 200, "locked"]
        ];

        const count = db.prepare("SELECT COUNT(*) AS count FROM cinemas").get().count;

        for (const cinema of cinemas) {
            const exists = db.prepare("SELECT id FROM cinemas WHERE name = ?").get(cinema[0]);
            if (!exists) insert.run(...cinema);
        }

        const all = db.prepare("SELECT id, name, status FROM cinemas ORDER BY id").all();
        console.log("Cinemas are ready:");
        console.table(all);
        console.log(`Previous cinemas: ${count}`);
        console.log("Target: 5 active cinemas + 1 temporarily locked cinema");
    } catch (error) {
        console.error("Error adding cinemas:", error.message);
    }
};

addCinemas();
