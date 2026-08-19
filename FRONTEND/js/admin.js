const API_URL = "http://localhost:3000/api";

// =====================================================
// DOM
// =====================================================

const adminName =
    document.getElementById("adminName");

const moviesCount =
    document.getElementById("moviesCount");

const cinemasCount =
    document.getElementById("cinemasCount");

const showsCount =
    document.getElementById("showsCount");

const bookingsCount =
    document.getElementById("bookingsCount");

const bookingsTable =
    document.getElementById("bookingsTable");

const moviesGrid =
    document.getElementById("moviesGrid");

const logoutBtn =
    document.getElementById("logoutBtn");


// =====================================================
// AUTHENTICATION
// =====================================================

function checkAdminAccess() {

    const token =
        localStorage.getItem("token");

    const userData =
        localStorage.getItem("user");

    if (!token || !userData) {

        window.location.href =
            "login.html";

        return false;
    }


    try {

        const user =
            JSON.parse(userData);


        if (user.role !== "admin") {

            alert(
                "Access denied. Admins only."
            );

            window.location.href =
                "movies.html";

            return false;
        }


        if (adminName) {

            adminName.textContent =
                user.name || "Admin";

        }


        return true;

    } catch (error) {

        console.error(
            "Invalid user data:",
            error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href =
            "login.html";

        return false;
    }

}


// =====================================================
// API REQUEST
// =====================================================

async function apiRequest(
    endpoint,
    options = {}
) {

    const token =
        localStorage.getItem("token");


    const response =
        await fetch(
            `${API_URL}${endpoint}`,
            {
                ...options,

                headers: {

                    "Content-Type":
                        "application/json",

                    ...(token
                        ? {
                            Authorization:
                                `Bearer ${token}`
                        }
                        : {}),

                    ...(options.headers || {})
                }
            }
        );


    const data =
        await response.json()
            .catch(() => ({}));


    if (!response.ok) {

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            alert(
                data.message ||
                "You are not authorized."
            );

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "login.html";

            throw new Error(
                "Unauthorized"
            );
        }


        throw new Error(
            data.message ||
            `Request failed (${response.status})`
        );

    }


    return data;

}


// =====================================================
// GET ARRAY FROM API RESPONSE
// =====================================================

function extractArray(
    data,
    possibleKeys = []
) {

    if (Array.isArray(data)) {

        return data;

    }


    for (
        const key of possibleKeys
    ) {

        if (
            Array.isArray(data[key])
        ) {

            return data[key];

        }

    }


    if (
        data.data &&
        Array.isArray(data.data)
    ) {

        return data.data;

    }


    return [];

}


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    try {

        setStatsLoading();


        const [
            moviesData,
            cinemasData,
            showsData,
            bookingsData
        ] = await Promise.all([

            apiRequest("/movies"),

            apiRequest("/cinemas"),

            apiRequest("/shows"),

            apiRequest("/bookings")

        ]);


        const movies =
            extractArray(
                moviesData,
                ["movies"]
            );


        const cinemas =
            extractArray(
                cinemasData,
                ["cinemas"]
            );


        const shows =
            extractArray(
                showsData,
                ["shows"]
            );


        const bookings =
            extractArray(
                bookingsData,
                ["bookings"]
            );


        // =================================================
        // UPDATE COUNTERS
        // =================================================

        moviesCount.textContent =
            movies.length;

        cinemasCount.textContent =
            cinemas.length;

        showsCount.textContent =
            shows.length;

        bookingsCount.textContent =
            bookings.length;


        // =================================================
        // DISPLAY
        // =================================================

        displayBookings(
            bookings
        );


        displayMovies(
            movies
        );


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        if (
            error.message !==
            "Unauthorized"
        ) {

            showDashboardError(
                error.message
            );

        }

    }

}


// =====================================================
// LOADING STATS
// =====================================================

function setStatsLoading() {

    moviesCount.textContent =
        "...";

    cinemasCount.textContent =
        "...";

    showsCount.textContent =
        "...";

    bookingsCount.textContent =
        "...";

}


// =====================================================
// DISPLAY BOOKINGS
// =====================================================

function displayBookings(
    bookings
) {

    if (!bookingsTable) {
        return;
    }


    if (
        !bookings ||
        bookings.length === 0
    ) {

        bookingsTable.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="table-loading"
                >
                    No bookings found.
                </td>

            </tr>

        `;

        return;
    }


    // Show latest bookings first

    const recentBookings =
        [...bookings]
            .reverse()
            .slice(0, 10);


    bookingsTable.innerHTML =
        recentBookings
            .map(
                booking => {

                    const status =
                        String(
                            booking.status ||
                            "confirmed"
                        ).toLowerCase();


                    const movieName =
                        escapeHTML(
                            booking.movie_title ||
                            booking.movie_name ||
                            booking.title ||
                            "Movie"
                        );


                    const userName =
                        escapeHTML(
                            booking.user_name ||
                            booking.name ||
                            booking.email ||
                            "Customer"
                        );


                    const seats =
                        booking.seats ||
                        booking.number_of_seats ||
                        booking.quantity ||
                        "N/A";


                    return `

                        <tr>

                            <td>
                                #${booking.id ?? "-"}
                            </td>

                            <td>
                                ${movieName}
                            </td>

                            <td>
                                ${userName}
                            </td>

                            <td>
                                ${escapeHTML(
                                    String(seats)
                                )}
                            </td>

                            <td>

                                <span
                                    class="status ${getStatusClass(status)}"
                                >
                                    ${escapeHTML(status)}
                                </span>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


// =====================================================
// DISPLAY MOVIES
// =====================================================

function displayMovies(
    movies
) {

    if (!moviesGrid) {
        return;
    }


    if (
        !movies ||
        movies.length === 0
    ) {

        moviesGrid.innerHTML = `

            <div class="table-loading">

                No movies found.

            </div>

        `;

        return;

    }


    moviesGrid.innerHTML =
        movies
            .map(
                movie => {

                    const title =
                        escapeHTML(
                            movie.title ||
                            "Untitled Movie"
                        );


                    const genre =
                        escapeHTML(
                            movie.genre ||
                            "Unknown genre"
                        );


                    const poster =
                        getPosterUrl(
                            movie.poster
                        );


                    return `

                        <article
                            class="admin-movie-card"
                        >

                            <div
                                class="admin-movie-poster"
                            >

                                <img
                                    src="${poster}"
                                    alt="${title}"
                                    onerror="
                                        this.onerror=null;
                                        this.src='images/movie-placeholder.svg';
                                    "
                                >

                            </div>


                            <div
                                class="admin-movie-info"
                            >

                                <h3>
                                    ${title}
                                </h3>

                                <p>
                                    ${genre}
                                </p>


                                <div
                                    class="admin-movie-actions"
                                >

                                    <button
                                        class="movie-action-btn"
                                        onclick="editMovie(${movie.id})"
                                    >
                                        Edit
                                    </button>


                                    <button
                                        class="movie-action-btn delete"
                                        onclick="deleteMovie(${movie.id})"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");

}


// =====================================================
// POSTER URL
// =====================================================

function getPosterUrl(
    poster
) {

    if (!poster) {

        return "images/movie-placeholder.svg";

    }


    if (
        poster.startsWith("http://") ||
        poster.startsWith("https://")
    ) {

        return poster;

    }


    if (
        poster.startsWith("/")
    ) {

        return `http://localhost:3000${poster}`;

    }


    return poster;

}


// =====================================================
// STATUS CLASS
// =====================================================

function getStatusClass(
    status
) {

    if (
        status.includes("cancel")
    ) {

        return "cancelled";

    }


    if (
        status.includes("pending")
    ) {

        return "pending";

    }


    return "confirmed";

}


// =====================================================
// DELETE MOVIE
// =====================================================

async function deleteMovie(
    movieId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this movie?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await apiRequest(
            `/movies/${movieId}`,
            {
                method: "DELETE"
            }
        );


        alert(
            "Movie deleted successfully."
        );


        loadDashboard();


    } catch (error) {

        if (
            error.message !==
            "Unauthorized"
        ) {

            alert(
                error.message
            );

        }

    }

}


// =====================================================
// EDIT MOVIE
// =====================================================

function editMovie(
    movieId
) {

    alert(
        `Edit Movie #${movieId}\n\nMovie editing form will be added next.`
    );

}


// =====================================================
// QUICK ACTIONS
// =====================================================

function setupActions() {

    const addMovieBtn =
        document.getElementById(
            "addMovieBtn"
        );

    const addMovieBtn2 =
        document.getElementById(
            "addMovieBtn2"
        );

    const addCinemaBtn =
        document.getElementById(
            "addCinemaBtn"
        );

    const addShowBtn =
        document.getElementById(
            "addShowBtn"
        );

    const viewBookingsBtn =
        document.getElementById(
            "viewBookingsBtn"
        );


    const addMovie =
        () => {

            alert(
                "Add Movie form will be added next."
            );

        };


    if (addMovieBtn) {

        addMovieBtn.addEventListener(
            "click",
            addMovie
        );

    }


    if (addMovieBtn2) {

        addMovieBtn2.addEventListener(
            "click",
            addMovie
        );

    }


    if (addCinemaBtn) {

        addCinemaBtn.addEventListener(
            "click",
            () => {

                alert(
                    "Add Cinema form will be added next."
                );

            }
        );

    }


    if (addShowBtn) {

        addShowBtn.addEventListener(
            "click",
            () => {

                alert(
                    "Add Show form will be added next."
                );

            }
        );

    }


    if (viewBookingsBtn) {

        viewBookingsBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "bookings.html";

            }
        );

    }

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


// =====================================================
// ERROR
// =====================================================

function showDashboardError(
    message
) {

    console.error(
        "Dashboard:",
        message
    );


    if (bookingsTable) {

        bookingsTable.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="table-loading"
                >
                    Unable to load dashboard data.
                </td>

            </tr>

        `;

    }


    if (moviesGrid) {

        moviesGrid.innerHTML = `

            <div class="table-loading">

                ⚠️ Unable to load movies.

                <br>

                <small>
                    ${escapeHTML(message)}
                </small>

            </div>

        `;

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            !checkAdminAccess()
        ) {

            return;

        }


        setupActions();

        loadDashboard();

    }
);