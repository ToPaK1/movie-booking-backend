const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendVerificationEmail = async (email, name, code) => {
    await transporter.sendMail({
        from: `"Movie Booking" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email - Movie Booking",
        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
                background: #f5f5f5;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                ">
                    <h2 style="color: #222;">
                        Welcome to Movie Booking 🎬
                    </h2>

                    <p>
                        Hello ${name},
                    </p>

                    <p>
                        Thank you for creating an account.
                        Please use the verification code below
                        to verify your email address:
                    </p>

                    <div style="
                        text-align: center;
                        margin: 30px 0;
                    ">
                        <span style="
                            display: inline-block;
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            background: #f0f0f0;
                            padding: 15px 25px;
                            border-radius: 8px;
                        ">
                            ${code}
                        </span>
                    </div>

                    <p>
                        This code will expire in
                        <strong>10 minutes</strong>.
                    </p>

                    <p>
                        If you did not create this account,
                        you can safely ignore this email.
                    </p>

                    <hr>

                    <p style="color: #777; font-size: 12px;">
                        Movie Booking System
                    </p>
                </div>
            </div>
        `
    });
};

module.exports = {
    sendVerificationEmail
};