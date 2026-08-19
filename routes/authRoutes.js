const express = require("express");

const {
    signup,
    login
} = require("../controllers/authController");

const {
    signupValidation,
    loginValidation
} = require("../middleware/validation");


// =====================================================
// ROUTER
// =====================================================

const router = express.Router();


// =====================================================
// SIGN UP
// =====================================================

router.post(
    "/signup",
    signupValidation,
    signup
);


// =====================================================
// LOGIN
// =====================================================

router.post(
    "/login",
    loginValidation,
    login
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;