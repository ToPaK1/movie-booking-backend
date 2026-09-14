require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function testEmail() {
    try {
        await transporter.verify();

        console.log("=================================");
        console.log("EMAIL SERVER READY ✅");
        console.log("Email:", process.env.EMAIL_USER);
        console.log("=================================");

    } catch (error) {

        console.log("=================================");
        console.log("EMAIL ERROR ❌");
        console.log("Code:", error.code);
        console.log("Message:", error.message);
        console.log("Response:", error.response);
        console.log("Response Code:", error.responseCode);
        console.log("=================================");

    }
}

testEmail();