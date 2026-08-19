const db = require("../config/database");


// =====================================================
// GET ALL USERS
// =====================================================
// Password is NEVER returned.

const getAllUsers = () => {

    return db.prepare(`
        SELECT
            id,
            name,
            email,
            role,
            phone
        FROM users
        ORDER BY id DESC
    `).all();

};


// =====================================================
// GET USER BY ID
// =====================================================
// Safe version.
// Password is NEVER returned.

const getUserById = (id) => {

    return db.prepare(`
        SELECT
            id,
            name,
            email,
            role,
            phone
        FROM users
        WHERE id = ?
    `).get(id);

};


// =====================================================
// GET USER BY EMAIL
// =====================================================
// IMPORTANT:
// This function is used internally for LOGIN.
// It MUST return the hashed password so that
// bcrypt.compare() can verify the password.
//
// DO NOT use this function directly in API responses.

const getUserByEmail = (email) => {

    return db.prepare(`
        SELECT
            id,
            name,
            email,
            password,
            role,
            phone
        FROM users
        WHERE email = ?
    `).get(email);

};


// =====================================================
// GET SAFE USER BY ID
// =====================================================
// This function is specifically for returning
// user information to the frontend.
//
// Password is NEVER selected.

const getSafeUserById = (id) => {

    return db.prepare(`
        SELECT
            id,
            name,
            email,
            role,
            phone
        FROM users
        WHERE id = ?
    `).get(id);

};


// =====================================================
// CREATE USER
// =====================================================

const createUser = ({
    name,
    email,
    password,
    role = "customer",
    phone = null
}) => {

    const stmt = db.prepare(`
        INSERT INTO users (
            name,
            email,
            password,
            role,
            phone
        )
        VALUES (?, ?, ?, ?, ?)
    `);

    return stmt.run(
        name,
        email,
        password,
        role,
        phone
    );

};


// =====================================================
// UPDATE USER ROLE
// =====================================================

const updateUserRole = (
    id,
    role
) => {

    return db.prepare(`
        UPDATE users
        SET role = ?
        WHERE id = ?
    `).run(
        role,
        id
    );

};


// =====================================================
// DELETE USER
// =====================================================

const deleteUser = (id) => {

    return db.prepare(`
        DELETE FROM users
        WHERE id = ?
    `).run(id);

};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    getAllUsers,
    getUserById,
    getUserByEmail,
    getSafeUserById,
    createUser,
    updateUserRole,
    deleteUser

};