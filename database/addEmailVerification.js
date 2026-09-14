const db = require("../config/database");

console.log("Adding email verification columns...");

try {
    db.exec(`
        ALTER TABLE users
        ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0;
    `);

    console.log("Added email_verified");
} catch (error) {
    if (!error.message.includes("duplicate column name")) {
        throw error;
    }

    console.log("email_verified already exists");
}

try {
    db.exec(`
        ALTER TABLE users
        ADD COLUMN verification_code TEXT;
    `);

    console.log("Added verification_code");
} catch (error) {
    if (!error.message.includes("duplicate column name")) {
        throw error;
    }

    console.log("verification_code already exists");
}

try {
    db.exec(`
        ALTER TABLE users
        ADD COLUMN verification_code_expires INTEGER;
    `);

    console.log("Added verification_code_expires");
} catch (error) {
    if (!error.message.includes("duplicate column name")) {
        throw error;
    }

    console.log("verification_code_expires already exists");
}

console.log("Email verification database update completed.");

db.close();