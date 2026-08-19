const { body, param, validationResult } = require("express-validator");


// =====================================================
// HANDLE VALIDATION ERRORS
// =====================================================

const handleValidationErrors = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array()
        });

    }

    next();
};


// =====================================================
// SIGNUP VALIDATION
// =====================================================

const signupValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),

    body("password")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 6, max: 100 })
        .withMessage("Password must be between 6 and 100 characters"),

    body("phone")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ min: 10, max: 15 })
        .withMessage("Phone number must be between 10 and 15 characters"),

    handleValidationErrors

];


// =====================================================
// LOGIN VALIDATION
// =====================================================

const loginValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),

    body("password")
        .isString()
        .withMessage("Password is required"),

    handleValidationErrors

];


// =====================================================
// CREATE BOOKING VALIDATION
// =====================================================

const createBookingValidation = [

    body("customer_name")
        .trim()
        .notEmpty()
        .withMessage("Customer name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Customer name must be between 2 and 100 characters"),

    body("customer_email")
        .trim()
        .notEmpty()
        .withMessage("Customer email is required")
        .isEmail()
        .withMessage("Please enter a valid customer email")
        .normalizeEmail(),

    body("show_id")
        .notEmpty()
        .withMessage("Show ID is required")
        .isInt({ min: 1 })
        .withMessage("Show ID must be a positive integer"),

    body("seats_booked")
        .notEmpty()
        .withMessage("Seats booked is required")
        .isInt({ min: 1 })
        .withMessage("Seats booked must be at least 1"),

    handleValidationErrors

];


// =====================================================
// UPDATE BOOKING VALIDATION
// =====================================================

const updateBookingValidation = [

    param("id")
        .isInt({ min: 1 })
        .withMessage("Booking ID must be a positive integer"),

    body("customer_name")
        .trim()
        .notEmpty()
        .withMessage("Customer name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Customer name must be between 2 and 100 characters"),

    body("customer_email")
        .trim()
        .notEmpty()
        .withMessage("Customer email is required")
        .isEmail()
        .withMessage("Please enter a valid customer email")
        .normalizeEmail(),

    body("show_id")
        .notEmpty()
        .withMessage("Show ID is required")
        .isInt({ min: 1 })
        .withMessage("Show ID must be a positive integer"),

    body("seats_booked")
        .notEmpty()
        .withMessage("Seats booked is required")
        .isInt({ min: 1 })
        .withMessage("Seats booked must be at least 1"),

    handleValidationErrors

];


// =====================================================
// BOOKING ID VALIDATION
// =====================================================

const bookingIdValidation = [

    param("id")
        .isInt({ min: 1 })
        .withMessage("Booking ID must be a positive integer"),

    handleValidationErrors

];


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    signupValidation,

    loginValidation,

    createBookingValidation,

    updateBookingValidation,

    bookingIdValidation

};