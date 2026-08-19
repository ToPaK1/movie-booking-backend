const API_URL = "http://localhost:3000/api";

const params = new URLSearchParams(
    window.location.search
);

const movieId = params.get("id");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");

const movieDetails =
    document.getElementById("movieDetails");

const movieTitle =
    document.getElementById("movieTitle");

const movieDescription =
    document.getElementById("movieDescription");

const movieGenre =
    document.getElementById("movieGenre");

const movieDuration =
    document.getElementById("movieDuration");

const movieRating =
    document.getElementById("movieRating");

const movieReleaseDate =
    document.getElementById("movieReleaseDate");

const showsContainer =
    document.getElementById("showsContainer");


// =====================================================
// LOAD MOVIE
// =====================================================

async function loadMovie() {

    try {

        if (!movieId) {
            throw new Error("Movie ID is missing");
        }

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

        console.log(
            "Movie:",
            movie
        );

        movieTitle.textContent =
            movie.title;

        movieDescription.textContent =
            movie.description || "";

        movieGenre.textContent =
            movie.genre || "";

        movieDuration.textContent =
            movie.duration || "-";

        movieRating.textContent =
            movie.rating || "-";

        movieReleaseDate.textContent =
            movie.release_date || "-";


        movieDetails.style.display =
            "block";

        loading.style.display =
            "none";


        loadShows();

    } catch (err) {

        console.error(err);

        loading.style.display =
            "none";

        error.style.display =
            "block";

        error.textContent =
            err.message ||
            "Unable to load movie.";

    }

}


// =====================================================
// LOAD SHOWS
// =====================================================

async function loadShows() {

    try {

        const response =
            await fetch(
                `${API_URL}/shows`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load shows"
            );
        }

        const shows =
            await response.json();

        console.log(
            "All Shows:",
            shows
        );


        const movieShows =
            shows.filter(
                show =>
                    Number(show.movie_id) ===
                    Number(movieId)
            );


        displayShows(
            movieShows
        );


    } catch (err) {

        console.error(err);

        showsContainer.innerHTML = `

            <div class="error-message">

                Unable to load available shows.

            </div>

        `;

    }

}


// =====================================================
// DISPLAY SHOWS
// =====================================================

function displayShows(shows) {

    showsContainer.innerHTML = "";


    if (shows.length === 0) {

        showsContainer.innerHTML = `

            <div class="error-message">

                No shows available for this movie.

            </div>

        `;

        return;

    }


    shows.forEach(show => {

        const card =
            document.createElement("div");

        card.className =
            "show-card";


        card.innerHTML = `

            <div class="show-card-content">

                <span class="show-label">
                    🎬 SHOWTIME
                </span>

                <h3>
                    ${show.cinema_name || "Cinema"}
                </h3>

                <p>
                    📍 ${show.location || ""}
                </p>

                <div class="show-info">

                    <span>
                        📅 ${show.show_date}
                    </span>

                    <span>
                        🕐 ${show.show_time}
                    </span>

                    <span>
                        💺 ${show.available_seats}
                        seats
                    </span>

                </div>

                <button
                    class="book-show-btn"
                    onclick="bookShow(${show.id})"
                >
                    🎟️ Book Now
                </button>

            </div>

        `;


        showsContainer.appendChild(
            card
        );

    });

}


// =====================================================
// BOOK SHOW
// =====================================================

function bookShow(showId) {

    console.log(
        "Selected Show ID:",
        showId
    );


    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        alert(
            "Please login before booking."
        );

        window.location.href =
            "login.html";

        return;

    }


    /*
     * Save useful show information
     * for the seat-selection page.
     */

    const show =
        document.querySelector(
            `[onclick="bookShow(${showId})"]`
        );


    if (show) {

        const card =
            show.closest(
                ".show-card"
            );


        if (card) {

            const cinema =
                card.querySelector(
                    "h3"
                );

            const info =
                card.querySelectorAll(
                    ".show-info span"
                );


            if (cinema) {

                localStorage.setItem(
                    "selectedCinema",
                    cinema.textContent.trim()
                );

            }


            if (info.length >= 2) {

                localStorage.setItem(
                    "selectedShowTime",
                    info[1].textContent
                        .replace("🕐", "")
                        .trim()
                );

            }

        }

    }


    localStorage.setItem(
        "selectedMovie",
        movieTitle.textContent
    );


    // IMPORTANT

    window.location.href =
        `seat-selection.html?showId=${showId}`;

}


// =====================================================
// START
// =====================================================

loadMovie();