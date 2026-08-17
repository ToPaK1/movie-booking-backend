const API_URL = "http://localhost:3000/api";

const token = localStorage.getItem("token");

const bookingsContainer =
    document.getElementById("bookingsContainer");

const loading =
    document.getElementById("loading");

const message =
    document.getElementById("message");

const logoutBtn =
    document.getElementById("logoutBtn");


/*
    Make sure the user is logged in
*/

if (!token) {

    window.location.href = "login.html";

}


/*
    Show message
*/

function showMessage(text, type) {

    message.textContent = text;

    message.className =
        `booking-message ${type}`;

    message.style.display = "block";

}


/*
    Get all bookings
*/

async function loadBookings() {

    try {

        loading.style.display = "block";

        const response = await fetch(
            `${API_URL}/bookings/my`,
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load bookings"
            );

        }


        loading.style.display = "none";


        displayBookings(data);


    } catch (error) {

        console.error(error);

        loading.style.display = "none";

        showMessage(
            error.message,
            "error"
        );

    }

}


/*
    Display bookings
*/

function displayBookings(bookings) {

    bookingsContainer.innerHTML = "";


    if (!bookings || bookings.length === 0) {

        bookingsContainer.innerHTML = `

            <div class="empty-bookings">

                <div class="icon">
                    🎟️
                </div>

                <h2>
                    No Bookings Yet
                </h2>

                <p>
                    You haven't booked any movies yet.
                </p>

                <a
                    href="movies.html"
                    class="browse-btn"
                >
                    Browse Movies
                </a>

            </div>

        `;

        return;

    }


    bookings.forEach(booking => {

        const card =
            document.createElement("div");

        card.className =
            "booking-card";


        card.innerHTML = `

            <div class="booking-top">

                <span class="booking-number">
                    Booking #${booking.id}
                </span>

                <span class="booking-status">
                    Confirmed
                </span>

            </div>


            <div class="booking-info">

                <div class="booking-info-item">

                    <span>
                        Customer
                    </span>

                    <strong>
                        ${booking.customer_name || "-"}
                    </strong>

                </div>


                <div class="booking-info-item">

                    <span>
                        Email
                    </span>

                    <strong>
                        ${booking.customer_email || "-"}
                    </strong>

                </div>


                <div class="booking-info-item">

                    <span>
                        Show ID
                    </span>

                    <strong>
                        #${booking.show_id || "-"}
                    </strong>

                </div>


                <div class="booking-info-item">

                    <span>
                        Seats
                    </span>

                    <strong>
                        🎟 ${booking.seats_booked || 0}
                    </strong>

                </div>

            </div>


            <div class="booking-actions">

                <button
                    class="cancel-btn"
                    onclick="cancelBooking(${booking.id})"
                >
                    Cancel Booking
                </button>

            </div>

        `;


        bookingsContainer.appendChild(card);

    });

}


/*
    Cancel booking
*/

async function cancelBooking(id) {

    const confirmed =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/bookings/${id}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to cancel booking"
            );

        }


        showMessage(
            "Booking cancelled successfully.",
            "success"
        );


        loadBookings();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "error"
        );

    }

}


/*
    Logout
*/

logoutBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href =
            "login.html";

    }
);


loadBookings();