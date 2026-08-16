const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

const createAdmin = async () => {
    try {
        const email = "admin@cinebook.com";
        const password = "admin123";

        const existingUser = userModel.getUserByEmail(email);

        if (existingUser) {
            console.log("Admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        userModel.createUser({
            name: "Cinema Admin",
            email: email,
            password: hashedPassword,
            role: "admin",
            phone: null
        });

        console.log("Admin created successfully");
        console.log("Email:", email);
        console.log("Password:", password);

    } catch (error) {
        console.error("Error creating admin:", error.message);
    }
};

createAdmin();