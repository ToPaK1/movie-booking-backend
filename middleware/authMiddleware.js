const jwt = require("jsonwebtoken");


// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const authenticateToken = (req, res, next) => {

    try {

        // =============================================
        // GET AUTHORIZATION HEADER
        // =============================================

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({
                message:
                    "Access denied. No token provided."
            });

        }


        // =============================================
        // CHECK BEARER TOKEN
        // =============================================

        const parts =
            authHeader.split(" ");


        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {

            return res.status(401).json({
                message:
                    "Invalid authorization format."
            });

        }


        const token =
            parts[1];


        if (!token) {

            return res.status(401).json({
                message:
                    "Access denied. Token is missing."
            });

        }


        // =============================================
        // VERIFY JWT
        // =============================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // =============================================
        // STORE USER DATA
        // =============================================
        // IMPORTANT:
        // The JWT payload contains ONLY:
        // id
        // email
        // role
        //
        // NEVER password.

        req.user = {

            id: decoded.id,

            email: decoded.email,

            role: decoded.role

        };


        // =============================================
        // CONTINUE
        // =============================================

        next();

    } catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );


        if (
            error.name ===
            "TokenExpiredError"
        ) {

            return res.status(401).json({
                message:
                    "Token has expired."
            });

        }


        if (
            error.name ===
            "JsonWebTokenError"
        ) {

            return res.status(401).json({
                message:
                    "Invalid token."
            });

        }


        return res.status(401).json({
            message:
                "Authentication failed."
        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = authenticateToken;