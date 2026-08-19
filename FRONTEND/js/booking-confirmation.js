// =====================================================
// CINEBOOK - BOOKING CONFIRMATION
// =====================================================


document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ================================
        // GET BOOKING DATA
        // ================================

        const bookingData =
            JSON.parse(
                localStorage.getItem(
                    "bookingConfirmation"
                )
            );


        // ================================
        // ELEMENTS
        // ================================

        const movie =
            document.getElementById(
                "ticketMovie"
            );

        const cinema =
            document.getElementById(
                "ticketCinema"
            );

        const date =
            document.getElementById(
                "ticketDate"
            );

        const time =
            document.getElementById(
                "ticketTime"
            );

        const seats =
            document.getElementById(
                "ticketSeats"
            );

        const bookingId =
            document.getElementById(
                "bookingId"
            );

        const poster =
            document.getElementById(
                "ticketPoster"
            );


        // ================================
        // NO BOOKING DATA
        // ================================

        if (!bookingData) {

            movie.textContent =
                "No Booking Found";

            cinema.textContent =
                "-";

            date.textContent =
                "-";

            time.textContent =
                "-";

            seats.textContent =
                "-";

            bookingId.textContent =
                "CB-NO-DATA";

            return;
        }


        // ================================
        // MOVIE
        // ================================

        movie.textContent =
            bookingData.movie ||
            "Movie";


        // ================================
        // CINEMA
        // ================================

        cinema.textContent =
            bookingData.cinema ||
            "Cinema";


        // ================================
        // DATE
        // ================================

        date.textContent =
            bookingData.date ||
            "-";


        // ================================
        // TIME
        // ================================

        time.textContent =
            bookingData.time ||
            "-";


        // ================================
        // SEATS
        // ================================

        if (
            Array.isArray(
                bookingData.seats
            )
        ) {

            seats.textContent =
                bookingData.seats.join(", ");

        } else {

            seats.textContent =
                bookingData.seats ||
                "-";

        }


        // ================================
        // BOOKING ID
        // ================================

        bookingId.textContent =
            bookingData.bookingId ||
            "CB-" +
            Date.now();


        // ================================
        // POSTER
        // ================================

        if (bookingData.poster) {

            poster.src =
                bookingData.poster;

        }


        // ================================
        // POSTER ERROR
        // ================================

        poster.addEventListener(
            "error",
            function () {

                poster.src =
                    "images/default-movie.jpg";

            }
        );

    }
);