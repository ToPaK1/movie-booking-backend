# 🎬 Movie Booking System - Backend

A RESTful backend API for a Movie Booking System built with Node.js, Express.js, and SQLite.

The system allows users to register and login, browse movies, cinemas and shows, and create and manage movie bookings.

---

## 🚀 Features

- User Registration
- User Login
- Password Hashing using bcrypt
- JWT Authentication
- Role-Based Authorization
- Customer and Admin roles
- Movie Management
- Cinema Management
- Show Management
- Movie Booking
- Booking Ownership
- View Personal Bookings
- Cancel Bookings
- Restore Available Seats after Cancellation
- Available Seats Validation
- Email Validation
- Central Error Handling
- SQLite Database
- RESTful API

---

## 🛠️ Technologies

- Node.js
- Express.js
- SQLite
- better-sqlite3
- bcryptjs
- JSON Web Token (JWT)
- CORS
- dotenv
- Nodemon

---

## 📁 Project Structure

```text
BACKEND SERVER/
│
├── config/
│   └── database.js
│
├── controllers/
│   ├── authController.js
│   ├── bookingController.js
│   ├── cinemaController.js
│   ├── movieController.js
│   └── showController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── errorHandler.js
│
├── models/
│   ├── userModel.js
│   ├── bookingModel.js
│   ├── cinemaModel.js
│   ├── movieModel.js
│   └── showModel.js
│
├── routes/
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   ├── cinemaRoutes.js
│   ├── movieRoutes.js
│   └── showRoutes.js
│
├── scripts/
│   └── createAdmin.js
│
├── data/
│   └── movie_booking.db
│
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md