const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        // Get Authorization header
        const authHeader =
            req.headers.authorization;


        // Check if token exists
        if (!authHeader) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        // Check Bearer format
        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({

                message:
                    "Invalid authorization format"

            });

        }


        // Extract token
        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({

                message:
                    "Token is missing"

            });

        }


        // Verify token
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // Store user information
        // inside request
        req.user = decoded;


        next();

    } catch (error) {

        if (
            error.name ===
            "TokenExpiredError"
        ) {

            return res.status(401).json({

                message:
                    "Token has expired"

            });

        }


        if (
            error.name ===
            "JsonWebTokenError"
        ) {

            return res.status(401).json({

                message:
                    "Invalid token"

            });

        }


        return res.status(500).json({

            message:
                "Authentication error",

            error:
                error.message

        });

    }

};

module.exports = authMiddleware;