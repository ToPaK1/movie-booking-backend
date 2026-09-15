require("dotenv").config();
const bcrypt = require("bcryptjs");
const readline = require("readline");
const userModel = require("../models/userModel");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (text) =>
    new Promise((resolve) => rl.question(text, resolve));

const createAdmin = async () => {

    try {

        console.log("\n=== CineBook Admin Creator ===\n");

        const name = (await question("Admin name: ")).trim();
        const email = (await question("Admin email: ")).trim().toLowerCase();
        const password = await question("Admin password: ");

        if (!name || !email || !password) {
            console.log("\nName, email, and password are required.");
            return;
        }

        if (password.length < 6) {
            console.log("\nPassword must be at least 6 characters.");
            return;
        }

        const existingUser = userModel.getUserByEmail(email);

        if (existingUser) {
            console.log("\nA user with this email already exists.");
            console.log("Role:", existingUser.role);
            return;
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const result = userModel.createUser({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            phone: null
        });

        // Admin accounts created by this script are trusted accounts,
        // so they are verified immediately.
        userModel.verifyEmail(result.lastInsertRowid);

        console.log("\nAdmin created successfully!");
        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Role: admin");
        console.log("Email verified: yes");

    } catch (error) {

        console.error("\nError creating admin:", error.message);

    } finally {

        rl.close();

    }

};

createAdmin();
