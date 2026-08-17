const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/database");


// ========================================
// SIGN UP
// ========================================

const signup = async (req, res, next) => {

    try {

        const {
            name,
            email,
            password,
            phone
        } = req.body;


        // ================= VALIDATION =================

        if (!name || !email || !password) {

            return res.status(400).json({

                message:
                    "Name, email and password are required"

            });

        }


        if (password.length < 6) {

            return res.status(400).json({

                message:
                    "Password must be at least 6 characters"

            });

        }


        // ================= CHECK EMAIL =================

        const existingUser =
            db.prepare(
                "SELECT * FROM users WHERE email = ?"
            ).get(email);


        if (existingUser) {

            return res.status(409).json({

                message:
                    "Email already exists"

            });

        }


        // ================= HASH PASSWORD =================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ================= CREATE USER =================

        const result =
            db.prepare(`
                INSERT INTO users
                (
                    name,
                    email,
                    password,
                    role,
                    phone
                )
                VALUES (?, ?, ?, ?, ?)
            `).run(
                name,
                email,
                hashedPassword,
                "customer",
                phone || null
            );


        // ================= RESPONSE =================

        res.status(201).json({

            message:
                "Account created successfully",

            userId:
                result.lastInsertRowid

        });

    } catch (error) {

        next(error);

    }

};


// ========================================
// LOGIN
// ========================================

const login = async (req, res, next) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ================= VALIDATION =================

        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email and password are required"

            });

        }


        // ================= FIND USER =================

        const user =
            db.prepare(
                "SELECT * FROM users WHERE email = ?"
            ).get(email);


        if (!user) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });

        }


        // ================= CHECK PASSWORD =================

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });

        }


        // ================= CREATE JWT =================

        const token =
            jwt.sign(

                {
                    id:
                        user.id,

                    email:
                        user.email,

                    role:
                        user.role

                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "24h"
                }

            );


        // ================= RESPONSE =================

        res.status(200).json({

            message:
                "Login successful",

            token,

            user: {

                id:
                    user.id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role,

                phone:
                    user.phone

            }

        });

    } catch (error) {

        next(error);

    }

};


module.exports = {

    signup,

    login

};