const db = require("../config/database");

// =====================================================
// GET ALL USERS
// =====================================================

const getAllUsers = () => {
    return db.prepare(`
        SELECT
            id,
            name,
            email,
            role,
            phone,
            email_verified
        FROM users
        ORDER BY id DESC
    `).all();
};

// =====================================================
// GET USER BY ID
// =====================================================

const getUserById = (id) => {
    return db.prepare(`
        SELECT
            id,
            name,
            email,
            role,
            phone,
            email_verified
        FROM users
        WHERE id = ?
    `).get(id);
};

// =====================================================
// GET USER BY EMAIL
// =====================================================
// Used internally for LOGIN and EMAIL VERIFICATION.

const getUserByEmail = (email) => {
    return db.prepare(`
        SELECT
            id,
            name,
            email,
            password,
            role,
            phone,
            email_verified,
            verification_code,
            verification_code_expires
        FROM users
        WHERE email = ?
    `).get(email);
};

// =====================================================
// GET SAFE USER BY ID
// =====================================================

const getSafeUserById = (id) => {
    return db.prepare(`
        SELECT
            id,
            name,
            email,
            role,
            phone,
            email_verified
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
    phone = null,
    verificationCode = null,
    verificationCodeExpires = null
}) => {

    const stmt = db.prepare(`
        INSERT INTO users (
            name,
            email,
            password,
            role,
            phone,
            email_verified,
            verification_code,
            verification_code_expires
        )
        VALUES (?, ?, ?, ?, ?, 0, ?, ?)
    `);

    return stmt.run(
        name,
        email,
        password,
        role,
        phone,
        verificationCode,
        verificationCodeExpires
    );
};

// =====================================================
// VERIFY EMAIL
// =====================================================

const verifyEmail = (id) => {

    return db.prepare(`
        UPDATE users
        SET
            email_verified = 1,
            verification_code = NULL,
            verification_code_expires = NULL
        WHERE id = ?
    `).run(id);
};

// =====================================================
// UPDATE VERIFICATION CODE
// =====================================================

const updateVerificationCode = (
    id,
    verificationCode,
    verificationCodeExpires
) => {

    return db.prepare(`
        UPDATE users
        SET
            verification_code = ?,
            verification_code_expires = ?
        WHERE id = ?
    `).run(
        verificationCode,
        verificationCodeExpires,
        id
    );
};

// =====================================================
// UPDATE USER ROLE
// =====================================================

const updateUserRole = (id, role) => {

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
    verifyEmail,
    updateVerificationCode,
    updateUserRole,
    deleteUser
};