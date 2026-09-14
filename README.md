# 🎬 CineBook — Movie Booking System

A full-stack movie booking system built as a student project using **Node.js, Express.js, SQLite, JWT, and Angular**.

CineBook lets customers discover movies, browse cinemas and showtimes, choose seats, complete a booking flow, receive booking confirmation, and manage their tickets. Admins can manage the movie catalog and cinema/show data through a dedicated dashboard.

## ✨ Main Features

### 👤 Authentication
- Customer registration and login
- Email verification with a 6-digit code
- Resend verification code
- Password hashing with `bcryptjs`
- JWT authentication
- JWT expiration
- Customer/admin roles
- Passwords are never returned in API responses
- Normal signup always creates a `customer`

### 🎬 Movies
- Browse all movies
- Movie details page
- Posters, genre, duration, release date and rating
- Search/filter support
- Upcoming showtimes per movie
- Favorite movies for authenticated users
- Admin create, update and delete

### 🏢 Cinemas & Shows
- Browse cinemas
- Cinema details
- Movie/cinema/show relationships
- Show date and time
- Ticket price
- Available-seat tracking
- Past shows are hidden from customer booking screens

### 🎟️ Booking & Tickets
- Protected booking flow
- Seat selection
- Prevent double-booking of selected seats
- Ticket price and total price calculation
- Booking ownership checks
- My Tickets page
- Ticket confirmation page
- Booking details and QR presentation
- Cancel booking
- Seats are restored after cancellation
- Email booking confirmation

### 👑 Admin Dashboard
- Movie management
- Cinema management
- Show management
- Booking overview
- Tickets sold
- Revenue statistics
- Revenue by movie
- Responsive admin interface

### 🎨 Angular Frontend
- Cinematic dark UI
- Responsive layouts for desktop, tablet and mobile
- Movie cards with posters and hover effects
- Movie details experience
- Seat-map booking interface
- Checkout/payment flow
- Booking confirmation ticket
- Profile dashboard
- Favorites
- Admin dashboard

## 🛡️ Security

- Passwords hashed with `bcryptjs`
- JWT stored and verified server-side
- Protected API routes require a Bearer token
- Admin operations require the `admin` role
- Normal signup cannot create an admin account
- Authentication endpoints are rate-limited
- General API requests are rate-limited
- Request body size is limited
- CORS is restricted to the local frontend origins used by the project
- `X-Powered-By` is disabled
- Basic security response headers are enabled
- `.env` and database files are excluded from Git
- Central error handling prevents raw application errors from being exposed

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- SQLite
- better-sqlite3
- bcryptjs
- jsonwebtoken
- express-rate-limit
- nodemailer
- dotenv
- CORS

### Frontend
- Angular
- TypeScript
- HTML
- CSS
- Angular Router
- RxJS

## 📁 Project Structure

```text
movie-booking-backend/
│
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── bookingController.js
│   ├── cinemaController.js
│   ├── movieController.js
│   └── showController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── errorHandler.js
├── models/
│   ├── userModel.js
│   ├── bookingModel.js
│   ├── cinemaModel.js
│   ├── movieModel.js
│   └── showModel.js
├── routes/
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   ├── cinemaRoutes.js
│   ├── favoriteRoutes.js
│   ├── movieRoutes.js
│   └── showRoutes.js
├── database/
│   └── initDatabase.js
├── scripts/
│   └── createAdmin.js
├── angular-frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   ├── pages/
│   │   │   └── shared/
│   │   └── styles.css
│   ├── angular.json
│   └── package.json
├── data/
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
```

> `.env`, `node_modules`, and SQLite database files should not be committed to GitHub.

## ⚙️ Backend Installation

### 1. Clone the repository

```bash
git clone https://github.com/ToPaK1/movie-booking-backend.git
cd movie-booking-backend
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env` in the project root:

```env
PORT=3000
JWT_SECRET=your_long_random_secret_key
JWT_EXPIRES_IN=1d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

Keep `.env` private.

### 4. Initialize the database

```bash
node database/initDatabase.js
```

The application also contains startup database migration logic so an existing SQLite database can receive newer booking, ticket-price, catalog and show fields without requiring the database file to be committed.

### 5. Create an admin

```bash
node scripts/createAdmin.js
```

Normal signup remains `customer` only.

### 6. Start the backend

```bash
npm run dev
```

or:

```bash
npm start
```

Backend API:

```text
http://localhost:3000/api
```

## 🖥️ Angular Frontend

The Angular application lives inside the repository under `angular-frontend/`.

```bash
cd angular-frontend
npm install
ng serve
```

Development frontend:

```text
http://localhost:4200
```

The frontend communicates with the backend API at:

```text
http://localhost:3000/api
```

For the production-style setup used by the backend, the Angular build can be served from the backend's configured frontend directory.

## 🔐 Authentication API

Base URL:

```text
http://localhost:3000/api
```

### Signup

```http
POST /api/auth/signup
```

```json
{
  "name": "Test User",
  "email": "testuser@gmail.com",
  "password": "123456",
  "phone": "01012345678"
}
```

### Verify Email

```http
POST /api/auth/verify-email
```

```json
{
  "email": "testuser@gmail.com",
  "code": "123456"
}
```

### Resend Verification

```http
POST /api/auth/resend-verification
```

### Login

```http
POST /api/auth/login
```

```json
{
  "email": "testuser@gmail.com",
  "password": "123456"
}
```

Successful login returns a JWT and safe user information. The password is never returned.

## 🔑 Protected Requests

Protected endpoints use:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

The authentication middleware verifies the token and exposes only the authenticated user's `id`, `email`, and `role` to downstream controllers.

## 🎬 API Overview

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/movies` | Public |
| GET | `/api/movies/:id` | Public |
| POST | `/api/movies` | Admin |
| PUT | `/api/movies/:id` | Admin |
| DELETE | `/api/movies/:id` | Admin |
| GET | `/api/cinemas` | Public |
| GET | `/api/cinemas/:id` | Public |
| GET | `/api/shows` | Public |
| GET | `/api/shows/:id` | Public |
| GET | `/api/bookings` | Admin |
| GET | `/api/bookings/my` | Authenticated |
| GET | `/api/bookings/:id` | Owner/Admin |
| POST | `/api/bookings` | Authenticated |
| DELETE | `/api/bookings/:id` | Owner/Admin |
| GET | `/api/favorites` | Authenticated |
| POST/DELETE | `/api/favorites/:movieId` | Authenticated |

## 🎟️ Booking Logic

When a customer books seats:

```text
Choose movie
     ↓
Choose cinema/show
     ↓
Choose seats
     ↓
Validate availability
     ↓
Calculate ticket total
     ↓
Create booking
     ↓
Decrease available seats
     ↓
Payment/checkout flow
     ↓
Booking confirmation
     ↓
Email confirmation
```

When a booking is cancelled, its selected seats are restored to the show's available-seat count.

## 👥 Roles

### Customer

Customers can:
- Browse movies, cinemas and shows
- View movie details
- Save favorites
- Choose seats
- Create bookings
- View their tickets
- Cancel their own bookings
- View their profile

### Admin

Admins can additionally:
- Create/update/delete movies
- Manage cinemas
- Manage shows
- View booking statistics
- View ticket and revenue information

## 📱 Responsive Design

CineBook's frontend is designed for:
- Desktop
- Laptop/tablet widths
- Mobile screens

Key responsive areas include the navbar, home page, movie cards, movie details, show cards, booking seat map, checkout, tickets, profile and admin dashboard.

## 🧪 Project Verification

The project has been tested during development for:

- Successful signup/login flow
- JWT-protected routes
- Customer access restrictions
- Admin authorization
- Movie creation by admin
- Booking ownership
- Seat availability and restoration
- Ticket pricing and total calculation
- Email verification and confirmation flow
- Angular page routing and UI integration

## 📌 Notes for Demonstration

For a student project presentation, the main flow is:

```text
Home
 ↓
Movies
 ↓
Movie Details
 ↓
Choose Show
 ↓
Choose Seats
 ↓
Checkout
 ↓
Booking Confirmation
 ↓
My Tickets
```

Admin flow:

```text
Login as Admin
 ↓
Admin Dashboard
 ↓
Manage Movies / Cinemas / Shows
 ↓
Review Bookings & Revenue
```

## 👨‍💻 Project

**CineBook — Movie Booking System**

Built with:

**Angular + TypeScript + Node.js + Express.js + SQLite + JWT Authentication + Role-Based Authorization**
