# 🎬 Movie Booking System — Backend

A RESTful backend API for a Movie Booking System built with **Node.js, Express.js, and SQLite**.

The system allows users to register and log in securely, browse movies, cinemas, and shows, and create and manage movie bookings.

The project also includes **JWT Authentication** and **Role-Based Authorization** with two roles:

* `customer`
* `admin`

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User Registration
* User Login
* Password Hashing using `bcryptjs`
* JWT Authentication
* Protected Routes
* Role-Based Authorization
* Customer and Admin roles
* Authentication validation
* Duplicate email prevention
* Token expiration
* Unauthorized request handling

### 🎬 Movie Management

* Get all movies
* Get movie by ID
* Create movie — Admin only
* Update movie — Admin only
* Delete movie — Admin only

### 🏢 Cinema Management

* Cinema management
* Cinema information
* Location and seat capacity

### 🎞️ Show Management

* Create and manage movie shows
* Movie and cinema relationships
* Show date and time
* Available seats

### 🎟️ Booking Management

* Create bookings
* View bookings
* View personal bookings
* Update bookings
* Delete bookings
* Booking ownership
* Available seats validation
* Restore available seats after cancellation

### 🛡️ Security

* Passwords are never stored as plain text
* Passwords are hashed using `bcryptjs`
* JWT tokens are used for authentication
* Protected routes require a valid Bearer token
* Admin-only operations require the `admin` role
* `.env` is excluded from GitHub

---

# 🛠️ Technologies

* Node.js
* Express.js
* SQLite
* better-sqlite3
* bcryptjs
* JSON Web Token (`jsonwebtoken`)
* CORS
* dotenv
* Nodemon

---

# 📁 Project Structure

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
├── database/
│   └── initDatabase.js
│
├── scripts/
│   └── createAdmin.js
│
├── FRONTEND/
│
├── data/
│   └── movie_booking.db
│
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
```

> `.env`, `node_modules`, and database files should not be uploaded to GitHub.

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/ToPaK1/movie-booking-backend.git
```

Then enter the project folder:

```bash
cd movie-booking-backend
```

---

## 2. Install dependencies

```bash
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
JWT_SECRET=your_super_secret_key
```

### Important

Do not upload `.env` to GitHub.

The `.gitignore` file should contain:

```gitignore
node_modules/
.env
data/*.db
*.db
npm-debug.log
```

---

# 🗄️ Database Setup

The project uses **SQLite** with `better-sqlite3`.

Initialize the database using:

```bash
node database/initDatabase.js
```

This creates the required tables:

* `users`
* `movies`
* `cinemas`
* `shows`
* `bookings`

The initialization script also inserts sample movies, cinemas, shows, and bookings.

---

# 👑 Create an Admin User

The normal Signup endpoint creates users with the `customer` role.

To create an Admin user, run:

```bash
node scripts/createAdmin.js
```

The Admin account is created with a hashed password and the role:

```text
admin
```

---

# ▶️ Run the Server

### Development

If Nodemon is configured:

```bash
npm run dev
```

### Normal mode

```bash
node app.js
```

The server runs by default on:

```text
http://localhost:3000
```

---

# 🔐 Authentication API

Base URL:

```text
http://localhost:3000/api
```

---

## 1. User Signup

### Endpoint

```http
POST /api/auth/signup
```

### Request Body

```json
{
    "name": "Test User",
    "email": "testuser@gmail.com",
    "password": "123456",
    "phone": "01012345678"
}
```

### Successful Response

```json
{
    "message": "Account created successfully",
    "userId": 1
}
```

### Validation

Required fields:

* `name`
* `email`
* `password`

Password must contain at least 6 characters.

If the email already exists:

```text
409 Conflict
```

---

# 🔑 2. User Login

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
    "email": "testuser@gmail.com",
    "password": "123456"
}
```

### Successful Response

```json
{
    "message": "Login successful",
    "token": "JWT_TOKEN",
    "user": {
        "id": 1,
        "name": "Test User",
        "email": "testuser@gmail.com",
        "role": "customer",
        "phone": "01012345678"
    }
}
```

The returned JWT token must be used when accessing protected routes.

---

# 🛡️ JWT Authentication

Protected routes require the following HTTP header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Example:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

The authentication middleware:

1. Checks the Authorization header.
2. Checks the Bearer format.
3. Extracts the JWT.
4. Verifies the token using `JWT_SECRET`.
5. Stores the decoded user information in `req.user`.
6. Allows the request to continue.

---

# 👥 Role-Based Authorization

The system supports two roles:

```text
customer
admin
```

### Customer

Regular users can:

* Browse movies
* Browse cinemas
* Browse shows
* Create bookings
* Manage their bookings

### Admin

Admins can additionally:

* Create movies
* Update movies
* Delete movies

Admin movie routes are protected using:

```text
authMiddleware
        ↓
roleMiddleware("admin")
        ↓
movie controller
```

---

# 🎬 Movie API

| Method | Endpoint          | Access |
| ------ | ----------------- | ------ |
| GET    | `/api/movies`     | Public |
| GET    | `/api/movies/:id` | Public |
| POST   | `/api/movies`     | Admin  |
| PUT    | `/api/movies/:id` | Admin  |
| DELETE | `/api/movies/:id` | Admin  |

---

# 🎟️ Booking API

| Method | Endpoint            | Access        |
| ------ | ------------------- | ------------- |
| GET    | `/api/bookings`     | Authenticated |
| GET    | `/api/bookings/my`  | Authenticated |
| GET    | `/api/bookings/:id` | Authenticated |
| POST   | `/api/bookings`     | Authenticated |
| PUT    | `/api/bookings/:id` | Authenticated |
| DELETE | `/api/bookings/:id` | Authenticated |

All booking routes require:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 🏢 Cinema API

The Cinema API provides access to cinema information including:

* Cinema name
* Location
* Total seats

Base endpoint:

```http
/api/cinemas
```

---

# 🎞️ Shows API

The Shows API manages movie show information including:

* Movie
* Cinema
* Date
* Time
* Available seats

Base endpoint:

```http
/api/shows
```

---

# 🧪 Authentication Testing

The Authentication Module was tested successfully.

## Signup Test

```text
POST /api/auth/signup
```

Result:

```text
201 Created
Account created successfully
```

---

## Login Test

```text
POST /api/auth/login
```

Result:

```text
200 OK
Login successful
JWT token generated
```

---

## Protected Route Test

A protected booking route was tested:

```text
GET /api/bookings/my
```

With a valid JWT:

```text
Request accepted
```

Without a JWT:

```text
401 Unauthorized
Authentication required
```

---

## Role Authorization Test

A customer attempted to create a movie:

```text
POST /api/movies
```

Result:

```text
403 Forbidden
Access denied
```

An admin then attempted the same operation using a new Admin JWT.

Result:

```text
Movie created successfully
```

This confirms that Role-Based Authorization is working correctly.

---

# 🔒 Security Notes

* Passwords are hashed using `bcryptjs`.
* Passwords are never returned in API responses.
* JWT tokens are signed using a secret stored in `.env`.
* JWT tokens expire after 24 hours.
* Admin privileges are not available through normal Signup.
* Protected routes require authentication.
* Admin routes require the `admin` role.
* `.env` and database files are excluded from GitHub.

---

# 📌 API Base URL

```text
http://localhost:3000/api
```

---

# 👨‍💻 Project

**Movie Booking System**

Built using:

**Node.js + Express.js + SQLite + JWT Authentication + Role-Based Authorization**
