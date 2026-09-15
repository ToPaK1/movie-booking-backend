const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
require("dotenv").config();

const createAdmin = async () => {

    try {

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            throw new Error(
                "ADMIN_EMAIL and ADMIN_PASSWORD must be configured in .env"
            );
        }

        const existingUser =
            userModel.getUserByEmail(email);

        if (existingUser) {

            console.log("Admin already exists");

            if (existingUser.role === "admin" && !existingUser.email_verified) {
                userModel.verifyEmail(existingUser.id);
                console.log("Existing admin email marked as verified");
            }

            return;
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const result = userModel.createUser({
            name: "Cinema Admin",
            email,
            password: hashedPassword,
            role: "admin",
            phone: null
        });

        // Admin accounts created by this script are trusted accounts,
        // so they are verified immediately.
        userModel.verifyEmail(result.lastInsertRowid);

        console.log("Admin created successfully");
        console.log("Email:", email);
        console.log("Admin password is loaded securely from .env");

    } catch (error) {

        console.error(
            "Error creating admin:",
            error.message
        );

    }

};

createAdmin();
