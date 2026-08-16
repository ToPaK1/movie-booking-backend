const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");

// =========================
// SIGN UP
// =========================
const signup = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            phone
        } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // Check if email already exists
        const existingUser = userModel.getUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create customer
        const user = {
            name,
            email,
            password: hashedPassword,
            role: "customer",
            phone: phone || null
        };

        const result = userModel.createUser(user);

        res.status(201).json({
            message: "User registered successfully",
            userId: result.lastInsertRowid
        });

    } catch (error) {
        next(error);
    }
};


// =========================
// LOGIN
// =========================
const login = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = userModel.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
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