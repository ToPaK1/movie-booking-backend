const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

const createAdmin = async () => {

    try {

        const email = "admin@cinebook.com";
        const password = "admin123";

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
        console.log("Password:", password);

    } catch (error) {

        console.error(
            "Error creating admin:",
            error.message
        );

    }

};

createAdmin();
