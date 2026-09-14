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
        // GENERATE OTP
        // =========================

        const verificationCode =
            generateVerificationCode();

        // OTP expires after 10 minutes

        const verificationCodeExpires =
            Date.now() + (10 * 60 * 1000);

        // =========================
        // CREATE USER
        // =========================

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

        // =========================
        // GET CREATED USER
        // =========================

        const newUser =
            userModel.getSafeUserById(
                result.lastInsertRowid
            );

        // =========================
        // SEND EMAIL
        // =========================

        try {

            await sendVerificationEmail(
                email,
                name,
                verificationCode
            );

        } catch (emailError) {

            console.error(
                "Email sending failed:",
                emailError
            );

            // Delete account if email
            // could not be sent

            userModel.deleteUser(
                result.lastInsertRowid
            );

            return res.status(500).json({
                message:
                    "Account could not be created because verification email could not be sent"
            });
        }

        // =========================
        // RESPONSE
        // =========================

        return res.status(201).json({

            message:
                "Account created successfully. Verification code sent to your email.",

            userId:
                result.lastInsertRowid,

            emailVerified: false,

            user: newUser

        });

    } catch (error) {

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

        // =========================
        // VALIDATION
        // =========================

        if (!email || !code) {

            return res.status(400).json({
                message:
                    "Email and verification code are required"
            });
        }

        // =========================
        // VALIDATE CODE FORMAT
        // =========================

        if (!/^\d{6}$/.test(code)) {

            return res.status(400).json({
                message:
                    "Verification code must be 6 digits"
            });
        }

        // =========================
        // FIND USER
        // =========================

        const user =
            userModel.getUserByEmail(email);

        if (!user) {

            return res.status(404).json({
                message:
                    "User not found"
            });
        }

        // =========================
        // ALREADY VERIFIED
        // =========================

        if (user.email_verified) {

            return res.status(400).json({
                message:
                    "Email is already verified"
            });
        }

        // =========================
        // CHECK CODE
        // =========================

        if (
            !user.verification_code ||
            user.verification_code !== code
        ) {

            return res.status(400).json({
                message:
                    "Invalid verification code"
            });
        }

        // =========================
        // CHECK EXPIRATION
        // =========================

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

        // =========================
        // VERIFY EMAIL
        // =========================

        userModel.verifyEmail(user.id);

        // =========================
        // GET UPDATED USER
        // =========================

        const updatedUser =
            userModel.getSafeUserById(
                user.id
            );

        // =========================
        // RESPONSE
        // =========================

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

        // =========================
        // VALIDATION
        // =========================

        if (!email) {

            return res.status(400).json({
                message:
                    "Email is required"
            });
        }

        // =========================
        // FIND USER
        // =========================

        const user =
            userModel.getUserByEmail(email);

        if (!user) {

            return res.status(404).json({
                message:
                    "User not found"
            });
        }

        // =========================
        // CHECK VERIFIED
        // =========================

        if (user.email_verified) {

            return res.status(400).json({
                message:
                    "Email is already verified"
            });
        }

        // =========================
        // GENERATE NEW OTP
        // =========================

        const verificationCode =
            generateVerificationCode();

        const verificationCodeExpires =
            Date.now() + (10 * 60 * 1000);

        // =========================
        // SAVE NEW OTP
        // =========================

        userModel.updateVerificationCode(
            user.id,
            verificationCode,
            verificationCodeExpires
        );

        // =========================
        // SEND EMAIL
        // =========================

        await sendVerificationEmail(
            user.email,
            user.name,
            verificationCode
        );

        // =========================
        // RESPONSE
        // =========================

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
        // CHECK EMAIL VERIFICATION
        // =========================

        if (!user.email_verified) {

            return res.status(403).json({

                message:
                    "Please verify your email before logging in",

                emailVerified: false,

                email: user.email

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
    login,
    verifyEmail,
    resendVerificationCode
};