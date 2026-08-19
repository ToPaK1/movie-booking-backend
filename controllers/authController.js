const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// =====================================================
// SANITIZE USER
// =====================================================
// This function makes sure that password is NEVER
// returned to the frontend.

const sanitizeUser = (user) => {

    if (!user) {
        return null;
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
    };
};


// =====================================================
// SIGN UP
// =====================================================

const signup = async (req, res, next) => {

    try {

        const {
            name,
            email,
            password,
            phone
        } = req.body;


        // =========================
        // VALIDATION
        // =========================

        if (!name || !email || !password) {

            return res.status(400).json({
                message:
                    "Name, email and password are required"
            });

        }


        // =========================
        // EMAIL VALIDATION
        // =========================

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email)) {

            return res.status(400).json({
                message:
                    "Please enter a valid email address"
            });

        }


        // =========================
        // PASSWORD VALIDATION
        // =========================

        if (password.length < 6) {

            return res.status(400).json({
                message:
                    "Password must be at least 6 characters"
            });

        }


        // =========================
        // CHECK EXISTING USER
        // =========================

        const existingUser =
            userModel.getUserByEmail(email);


        if (existingUser) {

            return res.status(409).json({
                message:
                    "Email is already registered"
            });

        }


        // =========================
        // HASH PASSWORD
        // =========================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // =========================
        // CREATE USER
        // =========================

        const result =
            userModel.createUser({

                name,
                email,
                password: hashedPassword,
                role: "customer",
                phone: phone || null

            });


        // =========================
        // GET CREATED USER
        // =========================

        const newUser =
            userModel.getSafeUserById(
                result.lastInsertRowid
            );


        // =========================
        // RESPONSE
        // =========================

        return res.status(201).json({

            message:
                "Account created successfully",

            user: newUser

        });

    } catch (error) {

        next(error);

    }

};


// =====================================================
// LOGIN
// =====================================================

const login = async (req, res, next) => {

    try {

        const {
            email,
            password
        } = req.body;


        // =========================
        // VALIDATION
        // =========================

        if (!email || !password) {

            return res.status(400).json({
                message:
                    "Email and password are required"
            });

        }


        // =========================
        // FIND USER
        // =========================
        // IMPORTANT:
        // getUserByEmail() includes the
        // hashed password because bcrypt
        // needs it for comparison.

        const user =
            userModel.getUserByEmail(email);


        if (!user) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });

        }


        // =========================
        // CHECK PASSWORD
        // =========================

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


        // =========================
        // CREATE JWT
        // =========================

        const token =
            jwt.sign(

                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        process.env.JWT_EXPIRES_IN ||
                        "1d"
                }

            );


        // =========================
        // SAFE USER
        // =========================
        // Password is removed here.

        const safeUser =
            sanitizeUser(user);


        // =========================
        // RESPONSE
        // =========================

        return res.status(200).json({

            message:
                "Login successful",

            token,

            user: safeUser

        });

    } catch (error) {

        next(error);

    }

};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    signup,
    login

};