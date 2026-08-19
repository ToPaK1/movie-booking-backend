const API_URL = "http://localhost:3000/api";

const token = localStorage.getItem("token");

const bookingsContainer =
    document.getElementById("bookingsContainer");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");

const errorText =
    document.getElementById("errorText");

const empty =
    document.getElementById("empty");

const refreshBtn =
    document.getElementById("refreshBtn");

const loginBtn =
    document.getElementById("loginBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


// =====================================================
// LOGIN CHECK
// =====================================================

if (!token) {

    loading.style.display = "none";

    if (loginBtn) {
        loginBtn.style.display = "inline-block";
    }

    bookingsContainer.innerHTML = `

        <div class="empty-bookings">

            <div class="empty-icon">
                🔐
            </div>

            <h3>
                Login Required
            </h3>

            <p>
                Please login to see your bookings.
            </p>

            <a
                href="login.html"
                class="browse-btn"
            >
                Login →
            </a>

        </div>

    `;

} else {

    if (loginBtn) {
        loginBtn.style.display = "none";
    }

    if (logoutBtn) {
        logoutBtn.style.display = "inline-block";
    }

    loadBookings();
}


// =====================================================
// LOAD BOOKINGS
// =====================================================

async function loadBookings() {

    loading.style.display = "block";

    error.style.display = "none";

    if (empty) {
        empty.style.display = "none";
    }

    bookingsContainer.innerHTML = "";

    try {

        const response = await fetch(
            `${API_URL}/bookings/my`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        const data =
            await response.json();

        console.log(
            "My bookings:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load bookings"
            );

        }


        loading.style.display = "none";


        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            if (empty) {
                empty.style.display = "block";
            }

            updateStats([]);

            return;
        }


        updateStats(data);

        displayBookings(data);


    } catch (err) {

        console.error(err);

        loading.style.display = "none";

        error.style.display = "block";

        if (errorText) {

            errorText.textContent =
                err.message ||
                "Unable to load bookings.";

        } else {

            error.textContent =
                err.message ||
                "Unable to load bookings.";

        }

    }

}


// =====================================================
// DISPLAY BOOKINGS
// =====================================================

function displayBookings(bookings) {

    bookingsContainer.innerHTML = "";


    bookings.forEach(
        (booking, index) => {

            const card =
                document.createElement("article");


            card.className =
                "booking-card";


            card.style.animationDelay =
                `${index * 0.1}s`;


            // ==============================
            // MOVIE DATA
            // ==============================

            const movieTitle =
                booking.movie_title ||
                "Unknown Movie";

            const moviePoster =
                booking.movie_poster ||
                "";


            const cinemaName =
                booking.cinema_name ||
                "Unknown Cinema";

            const cinemaLocation =
                booking.cinema_location ||
                "";


            const showDate =
                booking.show_date ||
                "-";

            const showTime =
                booking.show_time ||
                "-";


            const seats =
                Number(
                    booking.seats_booked || 0
                );


            // ==============================
            // POSTER
            // ==============================

            const posterHTML =
                moviePoster
                    ? `
                        <img
                            src="${moviePoster}"
                            alt="${movieTitle}"
                            class="booking-poster"
                            onerror="
                                this.style.display='none';
                                this.nextElementSibling.style.display='flex';
                            "
                        >

                        <div
                            class="poster-fallback"
                            style="display:none;"
                        >
                            🎬
                        </div>
                    `
                    : `
                        <div class="poster-fallback">
                            🎬
                        </div>
                    `;


            // ==============================
            // CARD
            // ==============================

            card.innerHTML = `

                <div class="booking-card-header">

                    <span class="booking-number">
                        BOOKING #${booking.id}
                    </span>

                    <span class="booking-status">
                        ✓ CONFIRMED
                    </span>

                </div>


                <div class="booking-body">


                    <!-- MOVIE -->

                    <div class="booking-movie">

                        <div class="booking-poster-wrapper">

                            ${posterHTML}

                        </div>


                        <div class="booking-movie-info">

                            <span class="movie-label">
                                MOVIE
                            </span>

                            <h3>
                                ${movieTitle}
                            </h3>

                            <p>
                                ${booking.movie_genre || "Cinema Experience"}
                            </p>

                        </div>

                    </div>


                    <!-- SHOW DETAILS -->

                    <div class="booking-show">

                        <div class="show-item">

                            <span>
                                📅 DATE
                            </span>

                            <strong>
                                ${showDate}
                            </strong>

                        </div>


                        <div class="show-item">

                            <span>
                                🕐 TIME
                            </span>

                            <strong>
                                ${showTime}
                            </strong>

                        </div>


                        <div class="show-item">

                            <span>
                                💺 SEATS
                            </span>

                            <strong>
                                ${seats}
                            </strong>

                        </div>

                    </div>


                    <!-- CINEMA -->

                    <div class="booking-cinema">

                        <div class="cinema-icon">
                            🎬
                        </div>

                        <div>

                            <span>
                                CINEMA
                            </span>

                            <strong>
                                ${cinemaName}
                            </strong>

                            ${
                                cinemaLocation
                                    ? `<small>${cinemaLocation}</small>`
                                    : ""
                            }

                        </div>

                    </div>


                    <!-- CUSTOMER -->

                    <div class="booking-customer">

                        <div>

                            <span>
                                CUSTOMER
                            </span>

                            <strong>
                                ${booking.customer_name || "-"}
                            </strong>

                        </div>


                        <div>

                            <span>
                                EMAIL
                            </span>

                            <strong>
                                ${booking.customer_email || "-"}
                            </strong>

                        </div>

                    </div>


                </div>


                <div class="booking-card-footer">

                    <span class="ticket-price">

                        🎟️

                        ${seats}

                        Ticket${seats > 1 ? "s" : ""}

                    </span>


                    <a
                        href="booking-confirmation.html?id=${booking.id}"
                        class="view-ticket"
                    >
                        View Ticket →
                    </a>

                </div>

            `;


            bookingsContainer.appendChild(card);


            // 3D EFFECT

            addTiltEffect(card);

        }
    );

}


// =====================================================
// 3D TILT EFFECT
// =====================================================

function addTiltEffect(card) {

    card.addEventListener(
        "mousemove",
        event => {

            const rect =
                card.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            const centerX =
                rect.width / 2;


            const centerY =
                rect.height / 2;


            const rotateX =
                (y - centerY) / 25;


            const rotateY =
                (centerX - x) / 25;


            card.style.transform = `

                perspective(1000px)

                rotateX(${rotateX}deg)

                rotateY(${rotateY}deg)

                translateY(-8px)

                scale(1.01)

            `;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform = "";

        }
    );

}


// =====================================================
// STATS
// =====================================================

function updateStats(bookings) {

    const total =
        bookings.length;


    const seats =
        bookings.reduce(
            (sum, booking) => {

                return (
                    sum +
                    Number(
                        booking.seats_booked || 0
                    )
                );

            },
            0
        );


    const totalBookings =
        document.getElementById(
            "totalBookings"
        );

    const upcomingBookings =
        document.getElementById(
            "upcomingBookings"
        );

    const seatsBooked =
        document.getElementById(
            "seatsBooked"
        );


    if (totalBookings) {

        totalBookings.textContent =
            total;

    }


    if (upcomingBookings) {

        upcomingBookings.textContent =
            total;

    }


    if (seatsBooked) {

        seatsBooked.textContent =
            seats;

    }

}


// =====================================================
// REFRESH
// =====================================================

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        () => {

            refreshBtn.style.transform =
                "rotate(360deg)";


            setTimeout(
                () => {

                    refreshBtn.style.transform =
                        "";

                },
                500
            );


            loadBookings();

        }
    );

}


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );


            window.location.href =
                "login.html";

        }
    );

}