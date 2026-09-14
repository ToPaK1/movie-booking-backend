const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userModel = require("../models/userModel");
const {
    sendVerificationEmail
} = require("../services/emailService");

// =====================================================
// SANITIZE USER
// =====================================================

const sanitizeUser = (user) => {

    if (!user) {
        return null;
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        email_verified: Boolean(user.email_verified)
    };
};

// =====================================================
// GENERATE VERIFICATION CODE
// =====================================================

const generateVerificationCode = () => {

    return crypto
        .randomInt(100000, 1000000)
        .toString();
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

        if (!name || !email || !password) {

            return res.status(400).json({
                message:
                    "Name, email and password are required"
            });
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            return res.status(400).json({
                message:
                    "Please enter a valid email address"
            });
        }

        if (password.length < 6) {

            return res.status(400).json({
                message:
                    "Password must be at least 6 characters"
            });
        }

        const existingUser =
            userModel.getUserByEmail(email);

        if (existingUser) {

            return res.status(409).json({
                message:
                    "Email is already registered"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const verificationCode =
            generateVerificationCode();

        const verificationCodeExpires =
            Date.now() + (10 * 60 * 1000);

        const result =
            userModel.createUser({

                name,
                email,
                password: hashedPassword,
                role: "customer",
                phone: phone || null,

                verificationCode,
                verificationCodeExpires
            });

        const newUser =
            userModel.getSafeUserById(
                result.lastInsertRowid
            );

        // =================================================
        // SEND VERIFICATION EMAIL
        // =================================================

        try {

            await sendVerificationEmail(
                email,
                name,
                verificationCode
            );

        } catch (emailError) {

            console.error("=================================");
            console.error("EMAIL SENDING FAILED ❌");
            console.error("Code:", emailError.code);
            console.error("Message:", emailError.message);
            console.error("Response:", emailError.response);
            console.error("Response Code:", emailError.responseCode);
            console.error("=================================");

            userModel.deleteUser(
                result.lastInsertRowid
            );

            return res.status(500).json({
                message:
                    "Account could not be created because verification email could not be sent"
            });
        }

        return res.status(201).json({

            message:
                "Account created successfully. Verification code sent to your email.",

            userId:
                result.lastInsertRowid,

            emailVerified: false,

            user: newUser
        });

    } catch (error) {

        console.error("SIGNUP ERROR:", error);

        next(error);
    }
};

// =====================================================
// VERIFY EMAIL
// =====================================================

const verifyEmail = async (req, res, next) => {

    try {

        const {
            email,
            code
        } = req.body;

        if (!email || !code) {

            return res.status(400).json({
                message:
                    "Email and verification code are required"
            });
        }

        if (!/^\d{6}$/.test(code)) {

            return res.status(400).json({
                message:
                    "Verification code must be 6 digits"
            });
        }

        const user =
            userModel.getUserByEmail(email);

        if (!user) {

            return res.status(404).json({
                message:
                    "User not found"
            });
        }

        if (user.email_verified) {

            return res.status(400).json({
                message:
                    "Email is already verified"
            });
        }

        if (
            !user.verification_code ||
            user.verification_code !== code
        ) {

            return res.status(400).json({
                message:
                    "Invalid verification code"
            });
        }

        if (
            !user.verification_code_expires ||
            Date.now() >
            user.verification_code_expires
        ) {

            return res.status(400).json({
                message:
                    "Verification code has expired"
            });
        }

        userModel.verifyEmail(user.id);

        const updatedUser =
            userModel.getSafeUserById(user.id);

        return res.status(200).json({

            message:
                "Email verified successfully",

            emailVerified: true,

            user: updatedUser
        });

    } catch (error) {

        next(error);
    }
};

// =====================================================
// RESEND VERIFICATION CODE
// =====================================================

const resendVerificationCode = async (
    req,
    res,
    next
) => {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({
                message:
                    "Email is required"
            });
        }

        const user =
            userModel.getUserByEmail(email);

        if (!user) {

            return res.status(404).json({
                message:
                    "User not found"
            });
        }

        if (user.email_verified) {

            return res.status(400).json({
                message:
                    "Email is already verified"
            });
        }

        const verificationCode =
            generateVerificationCode();

        const verificationCodeExpires =
            Date.now() + (10 * 60 * 1000);

        userModel.updateVerificationCode(
            user.id,
            verificationCode,
            verificationCodeExpires
        );

        await sendVerificationEmail(
            user.email,
            user.name,
            verificationCode
        );

        return res.status(200).json({

            message:
                "A new verification code has been sent to your email"
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

        if (!email || !password) {

            return res.status(400).json({
                message:
                    "Email and password are required"
            });
        }

        const user =
            userModel.getUserByEmail(email);

        if (!user) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

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

        if (!user.email_verified) {

            return res.status(403).json({

                message:
                    "Please verify your email before logging in",

                emailVerified: false,

                email: user.email
            });
        }

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

        const safeUser =
            sanitizeUser(user);

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
    login,
    verifyEmail,
    resendVerificationCode
};