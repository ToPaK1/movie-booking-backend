const API_BASE = "http://localhost:3000/api";

let movies = [];
let cinemas = [];
let shows = [];
let bookings = [];


// ===============================
// API
// ===============================

async function apiRequest(endpoint, options = {}) {

    const response = await fetch(
        `${API_BASE}${endpoint}`,
        {
            headers: {
                "Content-Type": "application/json"
            },
            ...options
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Something went wrong"
        );
    }

    return data;
}


// ===============================
// Navigation
// ===============================

document.querySelectorAll(".nav-btn").forEach(button => {

    button.addEventListener("click", () => {

        const section = button.dataset.section;

        showSection(section);

    });

});


function showSection(sectionName) {

    document.querySelectorAll(".section")
        .forEach(section => {
            section.classList.remove("active");
        });

    document
        .getElementById(sectionName)
        .classList.add("active");


    document.querySelectorAll(".nav-btn")
        .forEach(button => {
            button.classList.remove("active");
        });


    const activeButton =
        document.querySelector(
            `.nav-btn[data-section="${sectionName}"]`
        );

    if (activeButton) {
        activeButton.classList.add("active");
    }


    const titles = {
        dashboard: "Dashboard",
        movies: "Movies",
        cinemas: "Cinemas",
        shows: "Shows",
        bookings: "Bookings"
    };

    document.getElementById("page-title")
        .textContent = titles[sectionName];


    if (sectionName === "movies") {
        loadMovies();
    }

    if (sectionName === "cinemas") {
        loadCinemas();
    }

    if (sectionName === "shows") {
        loadShows();
    }

    if (sectionName === "bookings") {
        loadBookings();
    }
}


// ===============================
// Initial Load
// ===============================

async function initialize() {

    try {

        await Promise.all([
            loadMovies(),
            loadCinemas(),
            loadShows(),
            loadBookings()
        ]);

        updateDashboard();

    } catch (error) {

        console.error(error);

        showToast(
            "Could not connect to backend",
            true
        );

    }

}


initialize();


// ===============================
// Movies
// ===============================

async function loadMovies() {

    try {

        movies = await apiRequest("/movies");

        renderMovies(movies);

        document.getElementById("movie-count")
            .textContent = movies.length;

        renderDashboardMovies();

    } catch (error) {

        console.error(error);

    }

}


function renderMovies(data) {

    const container =
        document.getElementById("movies-container");


    if (!data.length) {

        container.innerHTML =
            `<div class="empty">
                No movies found.
            </div>`;

        return;
    }


    container.innerHTML = data.map(movie => `

        <div class="movie-card">

            <div class="movie-cover">
                🎬
            </div>

            <div class="movie-info">

                <h3>
                    ${escapeHtml(movie.title)}
                </h3>

                <p class="movie-description">
                    ${escapeHtml(
                        movie.description || "No description"
                    )}
                </p>

                <div class="movie-meta">

                    <span>
                        ${escapeHtml(movie.genre || "Unknown")}
                    </span>

                    <span>
                        ${movie.duration || 0} min
                    </span>

                    <span class="rating">
                        ⭐ ${movie.rating || "N/A"}
                    </span>

                </div>

                <div class="movie-actions">

                    <button
                        class="edit-btn"
                        onclick="editMovie(${movie.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="danger-btn"
                        onclick="deleteMovie(${movie.id})"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    `).join("");

}


function searchMovies() {

    const search =
        document
            .getElementById("movie-search")
            .value
            .toLowerCase();


    const filtered = movies.filter(movie =>

        movie.title
            .toLowerCase()
            .includes(search)

        ||

        (movie.genre || "")
            .toLowerCase()
            .includes(search)

    );


    renderMovies(filtered);

}


function openMovieForm(movie = null) {

    const isEdit = movie !== null;

    document.getElementById("modal-title")
        .textContent =
        isEdit ? "Edit Movie" : "Add Movie";


    document.getElementById("modal-form").innerHTML = `

        <div class="form-group">

            <label>Movie Title</label>

            <input
                type="text"
                id="movie-title"
                value="${isEdit ? escapeAttribute(movie.title) : ""}"
                required
            >

        </div>


        <div class="form-group">

            <label>Description</label>

            <textarea
                id="movie-description"
                required
            >${isEdit ? escapeHtml(movie.description || "") : ""}</textarea>

        </div>


        <div class="form-group">

            <label>Genre</label>

            <input
                type="text"
                id="movie-genre"
                value="${isEdit ? escapeAttribute(movie.genre) : ""}"
                required
            >

        </div>


        <div class="form-group">

            <label>Duration (minutes)</label>

            <input
                type="number"
                id="movie-duration"
                value="${isEdit ? movie.duration : ""}"
                min="1"
                required
            >

        </div>


        <div class="form-group">

            <label>Release Date</label>

            <input
                type="date"
                id="movie-release-date"
                value="${isEdit ? movie.release_date : ""}"
                required
            >

        </div>


        <div class="form-group">

            <label>Rating</label>

            <input
                type="number"
                id="movie-rating"
                value="${isEdit ? movie.rating : ""}"
                min="0"
                max="10"
                step="0.1"
                required
            >

        </div>


        <button class="form-submit">
            ${isEdit ? "Update Movie" : "Create Movie"}
        </button>

    `;


    document.getElementById("modal-form")
        .onsubmit = async function(event) {

            event.preventDefault();


            const movieData = {

                title:
                    document.getElementById("movie-title").value,

                description:
                    document.getElementById("movie-description").value,

                genre:
                    document.getElementById("movie-genre").value,

                duration:
                    Number(
                        document.getElementById("movie-duration").value
                    ),

                release_date:
                    document.getElementById("movie-release-date").value,

                rating:
                    Number(
                        document.getElementById("movie-rating").value
                    )

            };


            try {

                if (isEdit) {

                    await apiRequest(
                        `/movies/${movie.id}`,
                        {
                            method: "PUT",
                            body: JSON.stringify(movieData)
                        }
                    );

                    showToast("Movie updated successfully");

                } else {

                    await apiRequest(
                        "/movies",
                        {
                            method: "POST",
                            body: JSON.stringify(movieData)
                        }
                    );

                    showToast("Movie created successfully");

                }


                closeModal();

                await loadMovies();

                updateDashboard();


            } catch (error) {

                showToast(error.message, true);

            }

        };


    openModal();

}


function editMovie(id) {

    const movie =
        movies.find(movie => movie.id === id);

    if (movie) {
        openMovieForm(movie);
    }

}


async function deleteMovie(id) {

    if (!confirm("Are you sure you want to delete this movie?")) {
        return;
    }


    try {

        await apiRequest(
            `/movies/${id}`,
            {
                method: "DELETE"
            }
        );


        showToast("Movie deleted successfully");

        await loadMovies();

        updateDashboard();


    } catch (error) {

        showToast(error.message, true);

    }

}


// ===============================
// Cinemas
// ===============================

async function loadCinemas() {

    try {

        cinemas =
            await apiRequest("/cinemas");

        renderCinemas(cinemas);

        document.getElementById("cinema-count")
            .textContent = cinemas.length;


    } catch (error) {

        console.error(error);

    }

}


function renderCinemas(data) {

    const container =
        document.getElementById("cinemas-container");


    if (!data.length) {

        container.innerHTML =
            `<div class="empty">
                No cinemas found.
            </div>`;

        return;
    }


    container.innerHTML = `

        <table>

            <thead>

                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Total Seats</th>
                    <th>Actions</th>
                </tr>

            </thead>

            <tbody>

                ${data.map(cinema => `

                    <tr>

                        <td>#${cinema.id}</td>

                        <td>
                            <strong>
                                ${escapeHtml(cinema.name)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(cinema.location)}
                        </td>

                        <td>
                            ${cinema.total_seats}
                        </td>

                        <td>

                            <div class="actions">

                                <button
                                    class="edit-btn"
                                    onclick="editCinema(${cinema.id})"
                                >
                                    Edit
                                </button>

                                <button
                                    class="danger-btn"
                                    onclick="deleteCinema(${cinema.id})"
                                >
                                    Delete
                                </button>

                            </div>

                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

    `;

}


function openCinemaForm(cinema = null) {

    const isEdit = cinema !== null;

    document.getElementById("modal-title")
        .textContent =
        isEdit ? "Edit Cinema" : "Add Cinema";


    document.getElementById("modal-form").innerHTML = `

        <div class="form-group">

            <label>Cinema Name</label>

            <input
                type="text"
                id="cinema-name"
                value="${isEdit ? escapeAttribute(cinema.name) : ""}"
                required
            >

        </div>


        <div class="form-group">

            <label>Location</label>

            <input
                type="text"
                id="cinema-location"
                value="${isEdit ? escapeAttribute(cinema.location) : ""}"
                required
            >

        </div>


        <div class="form-group">

            <label>Total Seats</label>

            <input
                type="number"
                id="cinema-seats"
                value="${isEdit ? cinema.total_seats : ""}"
                min="1"
                required
            >

        </div>


        <button class="form-submit">
            ${isEdit ? "Update Cinema" : "Create Cinema"}
        </button>

    `;


    document.getElementById("modal-form")
        .onsubmit = async function(event) {

            event.preventDefault();


            const cinemaData = {

                name:
                    document.getElementById("cinema-name").value,

                location:
                    document.getElementById("cinema-location").value,

                total_seats:
                    Number(
                        document.getElementById("cinema-seats").value
                    )

            };


            try {

                if (isEdit) {

                    await apiRequest(
                        `/cinemas/${cinema.id}`,
                        {
                            method: "PUT",
                            body: JSON.stringify(cinemaData)
                        }
                    );

                    showToast("Cinema updated successfully");

                } else {

                    await apiRequest(
                        "/cinemas",
                        {
                            method: "POST",
                            body: JSON.stringify(cinemaData)
                        }
                    );

                    showToast("Cinema created successfully");

                }


                closeModal();

                await loadCinemas();

                updateDashboard();


            } catch (error) {

                showToast(error.message, true);

            }

        };


    openModal();

}


function editCinema(id) {

    const cinema =
        cinemas.find(cinema => cinema.id === id);

    if (cinema) {
        openCinemaForm(cinema);
    }

}


async function deleteCinema(id) {

    if (!confirm("Are you sure you want to delete this cinema?")) {
        return;
    }


    try {

        await apiRequest(
            `/cinemas/${id}`,
            {
                method: "DELETE"
            }
        );


        showToast("Cinema deleted successfully");

        await loadCinemas();

        updateDashboard();


    } catch (error) {

        showToast(error.message, true);

    }

}


// ===============================
// Shows
// ===============================

async function loadShows() {

    try {

        shows =
            await apiRequest("/shows");

        renderShows(shows);

        document.getElementById("show-count")
            .textContent = shows.length;


    } catch (error) {

        console.error(error);

    }

}


function renderShows(data) {

    const container =
        document.getElementById("shows-container");


    if (!data.length) {

        container.innerHTML =
            `<div class="empty">
                No shows found.
            </div>`;

        return;
    }


    container.innerHTML = `

        <table>

            <thead>

                <tr>
                    <th>ID</th>
                    <th>Movie</th>
                    <th>Cinema</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Available Seats</th>
                    <th>Actions</th>
                </tr>

            </thead>

            <tbody>

                ${data.map(show => {

                    const movie =
                        movies.find(
                            movie => movie.id == show.movie_id
                        );

                    const cinema =
                        cinemas.find(
                            cinema => cinema.id == show.cinema_id
                        );


                    return `

                        <tr>

                            <td>#${show.id}</td>

                            <td>
                                ${escapeHtml(
                                    movie
                                        ? movie.title
                                        : `Movie #${show.movie_id}`
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    cinema
                                        ? cinema.name
                                        : `Cinema #${show.cinema_id}`
                                )}
                            </td>

                            <td>
                                ${show.show_date}
                            </td>

                            <td>
                                ${show.show_time}
                            </td>

                            <td>
                                ${show.available_seats}
                            </td>

                            <td>

                                <div class="actions">

                                    <button
                                        class="edit-btn"
                                        onclick="editShow(${show.id})"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        class="danger-btn"
                                        onclick="deleteShow(${show.id})"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </td>

                        </tr>

                    `;

                }).join("")}

            </tbody>

        </table>

    `;

}


function openShowForm(show = null) {

    const isEdit = show !== null;

    document.getElementById("modal-title")
        .textContent =
        isEdit ? "Edit Show" : "Add Show";


    document.getElementById("modal-form").innerHTML = `

        <div class="form-group">

            <label>Movie</label>

            <select id="show-movie" required>

                <option value="">
                    Select Movie
                </option>

                ${movies.map(movie => `

                    <option
                        value="${movie.id}"
                        ${isEdit && movie.id == show.movie_id ? "selected" : ""}
                    >
                        ${escapeHtml(movie.title)}
                    </option>

                `).join("")}

            </select>

        </div>


        <div class="form-group">

            <label>Cinema</label>

            <select id="show-cinema" required>

                <option value="">
                    Select Cinema
                </option>

                ${cinemas.map(cinema => `

                    <option
                        value="${cinema.id}"
                        ${isEdit && cinema.id == show.cinema_id ? "selected" : ""}
                    >
                        ${escapeHtml(cinema.name)}
                    </option>

                `).join("")}

            </select>

        </div>


        <div class="form-group">

            <label>Show Date</label>

            <input
                type="date"
                id="show-date"
                value="${isEdit ? show.show_date : ""}"
                required
            >

        </div>


        <div class="form-group">

            <label>Show Time</label>

            <input
                type="time"
                id="show-time"
                value="${isEdit ? show.show_time : ""}"
                required
            >

        </div>


        <div class="form-group">

            <label>Available Seats</label>

            <input
                type="number"
                id="show-seats"
                value="${isEdit ? show.available_seats : ""}"
                min="0"
                required
            >

        </div>


        <button class="form-submit">

            ${isEdit ? "Update Show" : "Create Show"}

        </button>

    `;


    document.getElementById("modal-form")
        .onsubmit = async function(event) {

            event.preventDefault();


            const showData = {

                movie_id:
                    Number(
                        document.getElementById("show-movie").value
                    ),

                cinema_id:
                    Number(
                        document.getElementById("show-cinema").value
                    ),

                show_date:
                    document.getElementById("show-date").value,

                show_time:
                    document.getElementById("show-time").value,

                available_seats:
                    Number(
                        document.getElementById("show-seats").value
                    )

            };


            try {

                if (isEdit) {

                    await apiRequest(
                        `/shows/${show.id}`,
                        {
                            method: "PUT",
                            body: JSON.stringify(showData)
                        }
                    );

                    showToast("Show updated successfully");

                } else {

                    await apiRequest(
                        "/shows",
                        {
                            method: "POST",
                            body: JSON.stringify(showData)
                        }
                    );

                    showToast("Show created successfully");

                }


                closeModal();

                await loadShows();

                updateDashboard();


            } catch (error) {

                showToast(error.message, true);

            }

        };


    openModal();

}


function editShow(id) {

    const show =
        shows.find(show => show.id === id);

    if (show) {
        openShowForm(show);
    }

}


async function deleteShow(id) {

    if (!confirm("Are you sure you want to delete this show?")) {
        return;
    }


    try {

        await apiRequest(
            `/shows/${id}`,
            {
                method: "DELETE"
            }
        );


        showToast("Show deleted successfully");

        await loadShows();

        updateDashboard();


    } catch (error) {

        showToast(error.message, true);

    }

}


// ===============================
// Bookings
// ===============================

async function loadBookings() {

    try {

        bookings =
            await apiRequest("/bookings");

        renderBookings(bookings);

        document.getElementById("booking-count")
            .textContent = bookings.length;

        renderDashboardBookings();


    } catch (error) {

        console.error(error);

    }

}


function renderBookings(data) {

    const container =
        document.getElementById("bookings-container");


    if (!data.length) {

        container.innerHTML =
            `<div class="empty">
                No bookings found.
            </div>`;

        return;
    }


    container.innerHTML = `

        <table>

            <thead>

                <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Show</th>
                    <th>Seats</th>
                    <th>Actions</th>
                </tr>

            </thead>

            <tbody>

                ${data.map(booking => {

                    const show =
                        shows.find(
                            show => show.id == booking.show_id
                        );


                    return `

                        <tr>

                            <td>#${booking.id}</td>

                            <td>
                                <strong>
                                    ${escapeHtml(
                                        booking.customer_name
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${escapeHtml(
                                    booking.customer_email
                                )}
                            </td>

                            <td>
                                ${show
                                    ? `${show.show_date} ${show.show_time}`
                                    : `Show #${booking.show_id}`
                                }
                            </td>

                            <td>
                                ${booking.seats_booked}
                            </td>

                            <td>

                                <div class="actions">

                                    <button
                                        class="edit-btn"
                                        onclick="editBooking(${booking.id})"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        class="danger-btn"
                                        onclick="deleteBooking(${booking.id})"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </td>

                        </tr>

                    `;

                }).join("")}

            </tbody>

        </table>

    `;

}


function openBookingForm(booking = null) {

    const isEdit = booking !== null;

    document.getElementById("modal-title")
        .textContent =
        isEdit ? "Edit Booking" : "New Booking";


    document.getElementById("modal-form").innerHTML = `

        <div class="form-group">

            <label>Customer Name</label>

            <input
                type="text"
                id="booking-name"
                value="${isEdit ? escapeAttribute(booking.customer_name) : ""}"
                required
            >

        </div>


        <div class="form-group">

            <label>Customer Email</label>

            <input
                type="email"
                id="booking-email"
                value="${isEdit ? escapeAttribute(booking.customer_email) : ""}"
                required
            >

        </div>


        <div class="form-group">

            <label>Show</label>

            <select id="booking-show" required>

                <option value="">
                    Select Show
                </option>

                ${shows.map(show => {

                    const movie =
                        movies.find(
                            movie => movie.id == show.movie_id
                        );

                    const cinema =
                        cinemas.find(
                            cinema => cinema.id == show.cinema_id
                        );


                    return `

                        <option
                            value="${show.id}"
                            ${isEdit && show.id == booking.show_id ? "selected" : ""}
                        >

                            ${escapeHtml(
                                movie
                                    ? movie.title
                                    : `Movie #${show.movie_id}`
                            )}

                            -

                            ${escapeHtml(
                                cinema
                                    ? cinema.name
                                    : `Cinema #${show.cinema_id}`
                            )}

                            -

                            ${show.show_date}
                            ${show.show_time}

                        </option>

                    `;

                }).join("")}

            </select>

        </div>


        <div class="form-group">

            <label>Seats Booked</label>

            <input
                type="number"
                id="booking-seats"
                value="${isEdit ? booking.seats_booked : 1}"
                min="1"
                required
            >

        </div>


        <button class="form-submit">

            ${isEdit ? "Update Booking" : "Create Booking"}

        </button>

    `;


    document.getElementById("modal-form")
        .onsubmit = async function(event) {

            event.preventDefault();


            const bookingData = {

                customer_name:
                    document.getElementById("booking-name").value,

                customer_email:
                    document.getElementById("booking-email").value,

                show_id:
                    Number(
                        document.getElementById("booking-show").value
                    ),

                seats_booked:
                    Number(
                        document.getElementById("booking-seats").value
                    )

            };


            try {

                if (isEdit) {

                    await apiRequest(
                        `/bookings/${booking.id}`,
                        {
                            method: "PUT",
                            body: JSON.stringify(bookingData)
                        }
                    );

                    showToast("Booking updated successfully");

                } else {

                    await apiRequest(
                        "/bookings",
                        {
                            method: "POST",
                            body: JSON.stringify(bookingData)
                        }
                    );

                    showToast("Booking created successfully");

                }


                closeModal();

                await loadBookings();

                updateDashboard();


            } catch (error) {

                showToast(error.message, true);

            }

        };


    openModal();

}


function editBooking(id) {

    const booking =
        bookings.find(
            booking => booking.id === id
        );

    if (booking) {
        openBookingForm(booking);
    }

}


async function deleteBooking(id) {

    if (!confirm("Are you sure you want to delete this booking?")) {
        return;
    }


    try {

        await apiRequest(
            `/bookings/${id}`,
            {
                method: "DELETE"
            }
        );


        showToast("Booking deleted successfully");

        await loadBookings();

        updateDashboard();


    } catch (error) {

        showToast(error.message, true);

    }

}


// ===============================
// Dashboard
// ===============================

function updateDashboard() {

    document.getElementById("movie-count")
        .textContent = movies.length;

    document.getElementById("cinema-count")
        .textContent = cinemas.length;

    document.getElementById("show-count")
        .textContent = shows.length;

    document.getElementById("booking-count")
        .textContent = bookings.length;

}


function renderDashboardMovies() {

    const container =
        document.getElementById(
            "dashboard-movies"
        );


    const latest =
        movies.slice(-5).reverse();


    if (!latest.length) {

        container.innerHTML =
            `<div class="empty">
                No movies yet.
            </div>`;

        return;
    }


    container.innerHTML =
        latest.map(movie => `

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding:12px 0;
                    border-bottom:1px solid #263247;
                "
            >

                <div>

                    <strong>
                        ${escapeHtml(movie.title)}
                    </strong>

                    <br>

                    <small>
                        ${escapeHtml(movie.genre || "Unknown")}
                    </small>

                </div>

                <span class="rating">
                    ⭐ ${movie.rating || "N/A"}
                </span>

            </div>

        `).join("");

}


function renderDashboardBookings() {

    const container =
        document.getElementById(
            "dashboard-bookings"
        );


    const latest =
        bookings.slice(-5).reverse();


    if (!latest.length) {

        container.innerHTML =
            `<div class="empty">
                No bookings yet.
            </div>`;

        return;
    }


    container.innerHTML =
        latest.map(booking => `

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding:12px 0;
                    border-bottom:1px solid #263247;
                "
            >

                <div>

                    <strong>
                        ${escapeHtml(
                            booking.customer_name
                        )}
                    </strong>

                    <br>

                    <small>
                        ${escapeHtml(
                            booking.customer_email
                        )}
                    </small>

                </div>

                <span>
                    🎟️ ${booking.seats_booked}
                </span>

            </div>

        `).join("");

}


// ===============================
// Modal
// ===============================

function openModal() {

    document
        .getElementById("modal")
        .classList.add("show");

}


function closeModal() {

    document
        .getElementById("modal")
        .classList.remove("show");

}


document
    .getElementById("modal")
    .addEventListener(
        "click",
        function(event) {

            if (event.target === this) {
                closeModal();
            }

        }
    );


// ===============================
// Toast
// ===============================

function showToast(message, error = false) {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;

    toast.classList.add("show");


    if (error) {
        toast.style.borderColor = "#ef4444";
    } else {
        toast.style.borderColor = "#22c55e";
    }


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


// ===============================
// Security Helpers
// ===============================

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {

    return escapeHtml(value);

}