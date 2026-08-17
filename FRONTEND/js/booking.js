const API_URL = "http://localhost:3000/api";

const params = new URLSearchParams(
    window.location.search
);

const showId = params.get("show_id");

const showIdElement =
    document.getElementById("showId");

const movieName =
    document.getElementById("movieName");

const cinemaName =
    document.getElementById("cinemaName");

const showDate =
    document.getElementById("showDate");

const showTime =
    document.getElementById("showTime");

const availableSeats =
    document.getElementById("availableSeats");

const bookingForm =
    document.getElementById("bookingForm");

const message =
    document.getElementById("message");


// ================= USER =================

const token =
    localStorage.getItem("token");

const savedUser =
    localStorage.getItem("user");


if (!token) {

    alert("Please login first.");

    window.location.href = "login.html";

}


// Fill user information

if (savedUser) {

    try {

        const user =
            JSON.parse(savedUser);

        document.getElementById(
            "customerName"
        ).value = user.name || "";

        document.getElementById(
            "customerEmail"
        ).value = user.email || "";

    } catch (error) {

        console.error(error);

    }

}


// ================= MESSAGE =================

function showMessage(text, type) {

    message.textContent = text;

    message.className =
        `booking-message ${type}`;

    message.style.display = "block";

}


// ================= LOAD SHOW =================

async function loadShow() {

    if (!showId) {

        showMessage(
            "No show selected.",
            "error"
        );

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/shows/${showId}`
        );


        if (!response.ok) {

            throw new Error(
                "Show not found"
            );

        }


        const show =
            await response.json();


        showIdElement.textContent =
            show.id;

        showDate.textContent =
            show.show_date || "-";

        showTime.textContent =
            show.show_time || "-";

        availableSeats.textContent =
            show.available_seats ?? 0;


        await loadMovie(show.movie_id);

        await loadCinema(show.cinema_id);


        // Set max seats

        const seatsInput =
            document.getElementById(
                "seatsBooked"
            );

        seatsInput.max =
            show.available_seats;


    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to load show information.",
            "error"
        );

    }

}


// ================= MOVIE =================

async function loadMovie(movieId) {

    try {

        const response = await fetch(
            `${API_URL}/movies/${movieId}`
        );


        if (!response.ok) {
            throw new Error(
                "Movie not found"
            );
        }


        const movie =
            await response.json();


        movieName.textContent =
            movie.title || "Unknown Movie";


    } catch (error) {

        console.error(error);

        movieName.textContent =
            "Unknown Movie";

    }

}


// ================= CINEMA =================

async function loadCinema(cinemaId) {

    try {

        const response = await fetch(
            `${API_URL}/cinemas/${cinemaId}`
        );


        if (!response.ok) {
            throw new Error(
                "Cinema not found"
            );
        }


        const cinema =
            await response.json();


        cinemaName.textContent =
            cinema.name || "Unknown Cinema";


    } catch (error) {

        console.error(error);

        cinemaName.textContent =
            "Unknown Cinema";

    }

}


// ================= CREATE BOOKING =================

bookingForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const customerName =
            document.getElementById(
                "customerName"
            ).value.trim();

        const customerEmail =
            document.getElementById(
                "customerEmail"
            ).value.trim();

        const seatsBooked =
            Number(
                document.getElementById(
                    "seatsBooked"
                ).value
            );


        if (!showId) {

            showMessage(
                "Please select a show first.",
                "error"
            );

            return;
        }


        if (seatsBooked < 1) {

            showMessage(
                "Please select at least one seat.",
                "error"
            );

            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/bookings`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        customer_name:
                            customerName,

                        customer_email:
                            customerEmail,

                        show_id:
                            Number(showId),

                        seats_booked:
                            seatsBooked

                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Booking failed"
                );

            }


            showMessage(
                `Booking created successfully! Booking ID: ${data.bookingId}`,
                "success"
            );


            bookingForm.reset();


            document.getElementById(
                "customerName"
            ).value = customerName;

            document.getElementById(
                "customerEmail"
            ).value = customerEmail;


            setTimeout(() => {

                window.location.href =
                    "bookings.html";

            }, 1500);


        } catch (error) {

            console.error(error);

            showMessage(
                error.message,
                "error"
            );

        }

    }
);


loadShow();