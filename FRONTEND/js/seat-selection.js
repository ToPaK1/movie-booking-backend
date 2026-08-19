// =====================================================
// CINEBOOK - REAL SEAT SELECTION + BOOKING
// =====================================================

const API_URL = "http://localhost:3000/api";


// =====================================================
// ELEMENTS
// =====================================================

const seatMap =
    document.getElementById("seatMap");

const selectedSeatsElement =
    document.getElementById("selectedSeats");

const totalPriceElement =
    document.getElementById("totalPrice");

const confirmBtn =
    document.getElementById("confirmBtn");

const movieName =
    document.getElementById("movieName");

const cinemaName =
    document.getElementById("cinemaName");

const showTime =
    document.getElementById("showTime");


// =====================================================
// SETTINGS
// =====================================================

const ticketPrice = 150;

let selectedSeats = [];


// =====================================================
// GET SHOW ID
// =====================================================

const params =
    new URLSearchParams(
        window.location.search
    );

const showId =
    params.get("showId");


// =====================================================
// CHECK LOGIN
// =====================================================

const token =
    localStorage.getItem("token");


if (!token) {

    alert(
        "Please login before booking."
    );

    window.location.href =
        "login.html";

}


// =====================================================
// LOAD SHOW INFORMATION
// =====================================================

async function loadShow() {

    if (!showId) {

        alert(
            "No show selected."
        );

        window.location.href =
            "movies.html";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/shows/${showId}`,
                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load show"
            );

        }


        const show =
            await response.json();


        console.log(
            "Show:",
            show
        );


        // ==============================
        // MOVIE
        // ==============================

        movieName.textContent =
            show.movie_title ||
            show.title ||
            "Movie";


        // ==============================
        // CINEMA
        // ==============================

        cinemaName.textContent =
            show.cinema_name ||
            show.cinema ||
            "Cinema";


        // ==============================
        // TIME
        // ==============================

        showTime.textContent =
            show.show_time ||
            show.time ||
            "-";


        // ==============================
        // AVAILABLE SEATS
        // ==============================

        createSeats(
            show.available_seats
        );


    } catch (error) {

        console.error(error);


        /*
         * If your shows endpoint does not
         * require authentication, the seat
         * map will still be created.
         */

        movieName.textContent =
            "Selected Movie";

        cinemaName.textContent =
            "Selected Cinema";

        showTime.textContent =
            "Selected Showtime";


        createSeats();

    }

}


// =====================================================
// CREATE SEATS
// =====================================================

function createSeats(
    availableSeats = null
) {

    seatMap.innerHTML = "";


    const rows = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G"
    ];


    const seatsPerRow = 8;


    /*
     * Demo occupied seats.
     *
     * The current backend only stores
     * available_seats as a number and
     * doesn't store seat numbers.
     */

    const occupiedSeats = [

        "A3",
        "A4",
        "B6",
        "C2",
        "C3",
        "D7",
        "E5",
        "F1",
        "G8"

    ];


    rows.forEach(
        row => {


            const rowElement =
                document.createElement(
                    "div"
                );


            rowElement.className =
                "seat-row";


            const label =
                document.createElement(
                    "span"
                );


            label.className =
                "row-label";


            label.textContent =
                row;


            rowElement.appendChild(
                label
            );


            for (
                let number = 1;
                number <= seatsPerRow;
                number++
            ) {


                const seatId =
                    `${row}${number}`;


                const seat =
                    document.createElement(
                        "button"
                    );


                seat.type =
                    "button";


                seat.className =
                    "seat";


                seat.textContent =
                    number;


                seat.dataset.seat =
                    seatId;


                // ==========================
                // OCCUPIED
                // ==========================

                if (
                    occupiedSeats.includes(
                        seatId
                    )
                ) {

                    seat.classList.add(
                        "occupied"
                    );

                    seat.disabled =
                        true;

                }


                // ==========================
                // CLICK
                // ==========================

                seat.addEventListener(
                    "click",
                    function () {

                        toggleSeat(
                            seat
                        );

                    }
                );


                rowElement.appendChild(
                    seat
                );

            }


            seatMap.appendChild(
                rowElement
            );

        }
    );

}


// =====================================================
// TOGGLE SEAT
// =====================================================

function toggleSeat(seat) {


    const seatId =
        seat.dataset.seat;


    // ==============================
    // REMOVE
    // ==============================

    if (
        selectedSeats.includes(
            seatId
        )
    ) {


        selectedSeats =
            selectedSeats.filter(
                id =>
                    id !== seatId
            );


        seat.classList.remove(
            "selected"
        );


    }

    // ==============================
    // ADD
    // ==============================

    else {


        selectedSeats.push(
            seatId
        );


        seat.classList.add(
            "selected"
        );

    }


    updateSummary();

}


// =====================================================
// UPDATE SUMMARY
// =====================================================

function updateSummary() {


    // No seats

    if (
        selectedSeats.length === 0
    ) {

        selectedSeatsElement.textContent =
            "None";

        totalPriceElement.textContent =
            "0";

        confirmBtn.disabled =
            true;

        return;

    }


    // Selected seats

    selectedSeatsElement.textContent =
        selectedSeats.join(
            ", "
        );


    // Total

    const total =
        selectedSeats.length *
        ticketPrice;


    totalPriceElement.textContent =
        total;


    confirmBtn.disabled =
        false;

}


// =====================================================
// CONFIRM BOOKING
// =====================================================

confirmBtn.addEventListener(
    "click",
    async function () {


        // ==============================
        // VALIDATION
        // ==============================

        if (
            selectedSeats.length === 0
        ) {

            alert(
                "Please select at least one seat."
            );

            return;

        }


        if (!showId) {

            alert(
                "Show ID is missing."
            );

            return;

        }


        if (!token) {

            alert(
                "Please login first."
            );

            window.location.href =
                "login.html";

            return;

        }


        // ==============================
        // GET USER
        // ==============================

        let user;


        try {

            const userResponse =
                await fetch(
                    `${API_URL}/auth/me`,
                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }
                );


            if (
                userResponse.ok
            ) {

                user =
                    await userResponse.json();

            }

        } catch (error) {

            console.log(
                "Could not load user information."
            );

        }


        // ==============================
        // CUSTOMER DATA
        // ==============================

        const customerName =
            user?.name ||
            user?.username ||
            localStorage.getItem(
                "userName"
            ) ||
            "CineBook Customer";


        const customerEmail =
            user?.email ||
            localStorage.getItem(
                "userEmail"
            ) ||
            "";


        // ==============================
        // VALIDATE EMAIL
        // ==============================

        if (!customerEmail) {

            alert(
                "We could not find your email. Please login again."
            );

            return;

        }


        // ==============================
        // REQUEST BODY
        // ==============================

        const bookingData = {

            customer_name:
                customerName,

            customer_email:
                customerEmail,

            show_id:
                Number(showId),

            seats_booked:
                selectedSeats.length

        };


        console.log(
            "Booking request:",
            bookingData
        );


        // ==============================
        // DISABLE BUTTON
        // ==============================

        confirmBtn.disabled =
            true;

        confirmBtn.textContent =
            "Booking...";


        try {


            // ==============================
            // SEND TO BACKEND
            // ==============================

            const response =
                await fetch(
                    `${API_URL}/bookings`,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify(
                                bookingData
                            )

                    }
                );


            // ==============================
            // RESPONSE
            // ==============================

            const data =
                await response.json();


            console.log(
                "Booking response:",
                data
            );


            // ==============================
            // ERROR
            // ==============================

            if (!response.ok) {

                throw new Error(

                    data.message ||
                    "Booking failed"

                );

            }


            // ==============================
            // SAVE CONFIRMATION
            // ==============================

            const confirmationData = {

                movie:
                    movieName.textContent,

                cinema:
                    cinemaName.textContent,

                date:
                    new Date()
                        .toLocaleDateString(
                            "en-GB"
                        ),

                time:
                    showTime.textContent,

                seats:
                    selectedSeats,

                bookingId:
                    data.bookingId,

                poster:
                    localStorage.getItem(
                        "selectedMoviePoster"
                    ) ||
                    "images/default-movie.jpg"

            };


            localStorage.setItem(

                "bookingConfirmation",

                JSON.stringify(
                    confirmationData
                )

            );


            // ==============================
            // SUCCESS
            // ==============================

            alert(
                "Booking created successfully! 🎬"
            );


            window.location.href =
                "booking-confirmation.html";


        } catch (error) {


            console.error(
                "Booking error:",
                error
            );


            alert(
                error.message ||
                "Something went wrong while booking."
            );


            confirmBtn.disabled =
                false;

            confirmBtn.textContent =
                "Confirm Booking";

        }

    }
);


// =====================================================
// START
// =====================================================

createSeats();

updateSummary();


// Load show information

loadShow();