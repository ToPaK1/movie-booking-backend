const db = require("../config/database");

const getAllUsers = () => {
    return db.prepare("SELECT id, name, email, role, phone FROM users").all();
};

const getUserById = (id) => {
    return db.prepare(
        "SELECT id, name, email, role, phone FROM users WHERE id = ?"
    ).get(id);
};

const getUserByEmail = (email) => {
    return db.prepare(
        "SELECT * FROM users WHERE email = ?"
    ).get(email);
};

const createUser = (user) => {
    const sql = `
        INSERT INTO users
        (name, email, password, role, phone)
        VALUES (?, ?, ?, ?, ?)
    `;

    return db.prepare(sql).run(
        user.name,
        user.email,
        user.password,
        user.role || "customer",
        user.phone || null
    );
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser
};