const express = require("express");

const router = express.Router();

const authController =
    require("../controllers/authController");

// ========================================
// SIGN UP
// ========================================

router.post(
    "/signup",
    authController.signup
);

// ========================================
// VERIFY EMAIL
// ========================================

router.post(
    "/verify-email",
    authController.verifyEmail
);

// ========================================
// RESEND VERIFICATION CODE
// ========================================

router.post(
    "/resend-verification",
    authController.resendVerificationCode
);

// ========================================
// LOGIN
// ========================================

router.post(
    "/login",
    authController.login
);

module.exports = router;