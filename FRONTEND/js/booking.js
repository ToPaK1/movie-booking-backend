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

const selectedSeatsContainer =
    document.getElementById("selectedSeats");

const selectedCount =
    document.getElementById("selectedCount");

const seatsBooked =
    document.getElementById("seatsBooked");


// ================= USER =================

const token =
    localStorage.getItem("token");

const savedUser =
    localStorage.getItem("user");


if (!token) {

    alert("Please login first.");

    window.location.href =
        "login.html";
}


// ================= SELECTED SEATS =================

let selectedSeats = [];

let maxSeats = 0;


// ================= USER DATA =================

if (savedUser) {

    try {

        const user =
            JSON.parse(savedUser);

        document.getElementById(
            "customerName"
        ).value =
            user.name || "";

        document.getElementById(
            "customerEmail"
        ).value =
            user.email || "";

    } catch (error) {

        console.error(error);

    }

}


// ================= MESSAGE =================

function showMessage(text, type) {

    message.textContent = text;

    message.className =
        `booking-message ${type}`;

    message.style.display =
        "block";

    message.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ================= SEAT SELECTION =================

function setupSeats() {

    const seats =
        document.querySelectorAll(
            ".seat.available"
        );


    seats.forEach(seat => {

        seat.addEventListener(
            "click",
            () => {

                const seatNumber =
                    seat.dataset.seat;


                if (
                    seat.classList.contains(
                        "selected"
                    )
                ) {

                    seat.classList.remove(
                        "selected"
                    );

                    selectedSeats =
                        selectedSeats.filter(
                            item =>
                                item !== seatNumber
                        );

                } else {

                    if (
                        selectedSeats.length >=
                        maxSeats
                    ) {

                        showMessage(
                            `You can select a maximum of ${maxSeats} seats.`,
                            "error"
                        );

                        return;
                    }


                    seat.classList.add(
                        "selected"
                    );

                    selectedSeats.push(
                        seatNumber
                    );

                }


                updateSeatSummary();

            }
        );

    });

}


// ================= UPDATE SEAT SUMMARY =================

function updateSeatSummary() {

    selectedCount.textContent =
        selectedSeats.length;

    seatsBooked.textContent =
        selectedSeats.length;


    selectedSeatsContainer.innerHTML =
        "";


    if (
        selectedSeats.length === 0
    ) {

        selectedSeatsContainer.innerHTML =
            `<span class="no-seats">
                No seats selected
            </span>`;

        return;
    }


    selectedSeats.forEach(
        seat => {

            const element =
                document.createElement(
                    "span"
                );

            element.className =
                "selected-seat";

            element.textContent =
                seat;

            selectedSeatsContainer.appendChild(
                element
            );

        }
    );

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

        const response =
            await fetch(
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


        maxSeats =
            Number(
                show.available_seats || 0
            );


        availableSeats.textContent =
            maxSeats;


        await loadMovie(
            show.movie_id
        );


        await loadCinema(
            show.cinema_id
        );


        setupSeats();


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

        const response =
            await fetch(
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
            movie.title ||
            "Unknown Movie";


    } catch (error) {

        console.error(error);

        movieName.textContent =
            "Unknown Movie";

    }

}


// ================= CINEMA =================

async function loadCinema(cinemaId) {

    try {

        const response =
            await fetch(
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
            cinema.name ||
            "Unknown Cinema";


    } catch (error) {

        console.error(error);

        cinemaName.textContent =
            "Unknown Cinema";

    }

}


// ================= CREATE BOOKING =================

bookingForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const customerName =
            document
                .getElementById(
                    "customerName"
                )
                .value
                .trim();


        const customerEmail =
            document
                .getElementById(
                    "customerEmail"
                )
                .value
                .trim();


        // ================= VALIDATION =================

        if (!showId) {

            showMessage(
                "Please select a show first.",
                "error"
            );

            return;
        }


        if (
            selectedSeats.length === 0
        ) {

            showMessage(
                "Please select at least one seat.",
                "error"
            );

            return;
        }


        if (!customerName) {

            showMessage(
                "Please enter your name.",
                "error"
            );

            return;
        }


        if (!customerEmail) {

            showMessage(
                "Please enter your email.",
                "error"
            );

            return;
        }


        // ================= BUTTON =================

        const button =
            document.querySelector(
                ".confirm-btn"
            );

        button.disabled =
            true;

        button.innerHTML =
            "⏳ Processing Booking...";


        try {

            const response =
                await fetch(
                    `${API_URL}/bookings`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body:
                            JSON.stringify({

                                customer_name:
                                    customerName,

                                customer_email:
                                    customerEmail,

                                show_id:
                                    Number(
                                        showId
                                    ),

                                seats_booked:
                                    selectedSeats.length

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
                `🎉 Booking created successfully! Booking ID: ${data.bookingId}`,
                "success"
            );


            button.innerHTML =
                "✓ Booking Confirmed";


            setTimeout(
                () => {

                    window.location.href =
                        "bookings.html";

                },
                1800
            );


        } catch (error) {

            console.error(error);


            button.disabled =
                false;

            button.innerHTML =
                `
                <span>🎟</span>
                Confirm Booking
                <span>→</span>
                `;


            showMessage(
                error.message,
                "error"
            );

        }

    }
);


// ================= START =================

loadShow();