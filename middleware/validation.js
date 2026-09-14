const { body, param, validationResult } = require("express-validator");

const handleValidationErrors=(req,res,next)=>{const errors=validationResult(req);if(!errors.isEmpty())return res.status(400).json({message:"Validation failed",errors:errors.array()});next();};
const signupValidation=[body("name").trim().notEmpty().isLength({min:2,max:100}),body("email").trim().isEmail().normalizeEmail(),body("password").isString().isLength({min:6,max:100}),body("phone").optional({values:"falsy"}).trim().isLength({min:10,max:15}),handleValidationErrors];
const loginValidation=[body("email").trim().isEmail().normalizeEmail(),body("password").isString().notEmpty(),handleValidationErrors];
const createBookingValidation=[
 body("show_id").isInt({min:1}).withMessage("Show ID must be a positive integer"),
 body("selected_seats").isArray({min:1}).withMessage("At least one seat is required"),
 body("selected_seats.*").isString().trim().matches(/^[A-J](?:[1-9]|1[0-9]|20)$/).withMessage("Invalid seat number"),
 handleValidationErrors
];
const updateBookingValidation=[param("id").isInt({min:1}),handleValidationErrors];
const bookingIdValidation=[param("id").isInt({min:1}),handleValidationErrors];
module.exports={signupValidation,loginValidation,createBookingValidation,updateBookingValidation,bookingIdValidation};