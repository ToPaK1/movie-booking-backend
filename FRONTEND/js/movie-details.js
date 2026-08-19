const API_URL = "http://localhost:3000/api";

// =====================================================
// GET MOVIE ID
// =====================================================

const urlParams =
    new URLSearchParams(window.location.search);

const movieId =
    urlParams.get("id");


// =====================================================
// DOM ELEMENTS
// =====================================================

const moviePoster =
    document.getElementById("moviePoster");

const movieTitle =
    document.getElementById("movieTitle");

const movieGenre =
    document.getElementById("movieGenre");

const movieDuration =
    document.getElementById("movieDuration");

const movieRating =
    document.getElementById("movieRating");

const movieReleaseDate =
    document.getElementById("movieReleaseDate");

const movieDescription =
    document.getElementById("movieDescription");

const showsContainer =
    document.getElementById("showsContainer");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");


// =====================================================
// LOAD MOVIE
// =====================================================

async function loadMovie() {

    if (!movieId) {

        showError(
            "Movie ID is missing."
        );

        return;

    }


    try {

        showLoading();

        hideError();


        // =================================================
        // GET MOVIE
        // =================================================

        const movieResponse =
            await fetch(
                `${API_URL}/movies/${movieId}`
            );


        if (!movieResponse.ok) {

            if (movieResponse.status === 404) {

                throw new Error(
                    "Movie not found."
                );

            }

            throw new Error(
                `Failed to load movie (${movieResponse.status})`
            );

        }


        const movieData =
            await movieResponse.json();


        const movie =
            movieData.movie ||
            movieData.data ||
            movieData;


        displayMovie(movie);


        // =================================================
        // GET SHOWS
        // =================================================

        await loadMovieShows(
            movieId
        );


    } catch (error) {

        console.error(
            "Error loading movie:",
            error
        );

        showError(
            error.message ||
            "Unable to load movie."
        );

    } finally {

        hideLoading();

    }

}


// =====================================================
// DISPLAY MOVIE
// =====================================================

function displayMovie(movie) {

    if (!movie) {

        showError(
            "Movie data is not available."
        );

        return;

    }


    // =================================================
    // TITLE
    // =================================================

    if (movieTitle) {

        movieTitle.textContent =
            movie.title ||
            "Untitled Movie";

    }


    // =================================================
    // GENRE
    // =================================================

    if (movieGenre) {

        movieGenre.textContent =
            movie.genre ||
            "Unknown";

    }


    // =================================================
    // DURATION
    // =================================================

    if (movieDuration) {

        movieDuration.textContent =
            movie.duration
                ? `${movie.duration} minutes`
                : "N/A";

    }


    // =================================================
    // RATING
    // =================================================

    if (movieRating) {

        movieRating.textContent =
            movie.rating !== null &&
            movie.rating !== undefined
                ? `⭐ ${Number(movie.rating).toFixed(1)}`
                : "⭐ N/A";

    }


    // =================================================
    // RELEASE DATE
    // =================================================

    if (movieReleaseDate) {

        movieReleaseDate.textContent =
            formatDate(
                movie.release_date
            );

    }


    // =================================================
    // DESCRIPTION
    // =================================================

    if (movieDescription) {

        movieDescription.textContent =
            movie.description ||
            "No description available.";

    }


    // =================================================
    // POSTER
    // =================================================

    displayMoviePoster(
        movie.poster,
        movie.title
    );

}


// =====================================================
// DISPLAY POSTER
// =====================================================

function displayMoviePoster(
    poster,
    title
) {

    if (!moviePoster) {
        return;
    }


    const posterUrl =
        getPosterUrl(poster);


    moviePoster.innerHTML = `

        <img
            src="${posterUrl}"
            alt="${escapeHTML(title || "Movie poster")}"
            class="movie-poster-image"
            onerror="
                this.onerror=null;
                this.src='images/movie-placeholder.svg';
            "
        >

    `;

}


// =====================================================
// GET POSTER URL
// =====================================================

function getPosterUrl(poster) {

    if (!poster) {

        return "images/movie-placeholder.svg";

    }


    if (
        poster.startsWith("http://") ||
        poster.startsWith("https://")
    ) {

        return poster;

    }


    if (poster.startsWith("/")) {

        return `http://localhost:3000${poster}`;

    }


    return poster;

}


// =====================================================
// LOAD MOVIE SHOWS
// =====================================================

async function loadMovieShows(
    movieId
) {

    if (!showsContainer) {
        return;
    }


    try {

        showsContainer.innerHTML = `

            <div class="shows-loading">
                Loading available shows...
            </div>

        `;


        const response =
            await fetch(
                `${API_URL}/shows`
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load shows (${response.status})`
            );

        }


        const data =
            await response.json();


        let shows = [];


        if (Array.isArray(data)) {

            shows = data;

        } else if (
            Array.isArray(data.shows)
        ) {

            shows = data.shows;

        } else if (
            Array.isArray(data.data)
        ) {

            shows = data.data;

        }


        const movieShows =
            shows.filter(
                (show) =>
                    Number(show.movie_id) ===
                    Number(movieId)
            );


        displayShows(
            movieShows
        );


    } catch (error) {

        console.error(
            "Error loading shows:",
            error
        );


        showsContainer.innerHTML = `

            <div class="error-state">

                <div>
                    ❌
                </div>

                <h3>
                    Unable to load shows
                </h3>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>

        `;

    }

}


// =====================================================
// DISPLAY SHOWS
// =====================================================

function displayShows(shows) {

    if (!showsContainer) {
        return;
    }


    showsContainer.innerHTML = "";


    if (!shows || shows.length === 0) {

        showsContainer.innerHTML = `

            <div class="no-shows">

                <div class="no-shows-icon">
                    🎭
                </div>

                <h3>
                    No shows available
                </h3>

                <p>
                    There are currently no available shows for this movie.
                </p>

            </div>

        `;

        return;

    }


    shows.forEach(
        (show) => {

            const showCard =
                createShowCard(show);


            showsContainer.appendChild(
                showCard
            );

        }
    );

}


// =====================================================
// CREATE SHOW CARD
// =====================================================

function createShowCard(show) {

    const card =
        document.createElement("div");


    card.className =
        "show-card";


    const showDate =
        formatDate(
            show.show_date
        );


    const showTime =
        formatTime(
            show.show_time
        );


    const availableSeats =
        show.available_seats !== undefined
            ? show.available_seats
            : "N/A";


    const cinemaName =
        escapeHTML(
            show.cinema_name ||
            show.cinema ||
            "Cinema"
        );


    card.innerHTML = `

        <div class="show-info">

            <div class="show-date">

                📅

                <span>
                    ${showDate}
                </span>

            </div>


            <div class="show-time">

                🕐

                <span>
                    ${showTime}
                </span>

            </div>


            <div class="show-cinema">

                🎬

                <span>
                    ${cinemaName}
                </span>

            </div>


            <div class="show-seats">

                💺

                <span>
                    ${availableSeats} seats available
                </span>

            </div>

        </div>


        <button
            type="button"
            class="book-show-btn"
            data-show-id="${show.id}"
        >
            Book Now
        </button>

    `;


    const bookButton =
        card.querySelector(
            ".book-show-btn"
        );


    if (bookButton) {

        bookButton.addEventListener(
            "click",
            () => {

                handleBooking(
                    show.id
                );

            }
        );

    }


    return card;

}


// =====================================================
// HANDLE BOOKING
// =====================================================

function handleBooking(
    showId
) {

    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        const shouldLogin =
            confirm(
                "You need to login before booking. Go to login page?"
            );


        if (shouldLogin) {

            window.location.href =
                "login.html";

        }


        return;

    }


    window.location.href =
        `booking.html?show_id=${encodeURIComponent(showId)}`;

}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(dateString) {

    if (!dateString) {

        return "N/A";

    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (Number.isNaN(date.getTime())) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


// =====================================================
// FORMAT TIME
// =====================================================

function formatTime(timeString) {

    if (!timeString) {

        return "N/A";

    }


    const parts =
        timeString.split(":");


    if (parts.length < 2) {

        return timeString;

    }


    let hour =
        Number(parts[0]);


    const minute =
        parts[1];


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12 || 12;


    return `${hour}:${minute} ${period}`;

}


// =====================================================
// LOADING
// =====================================================

function showLoading() {

    if (!loading) {
        return;
    }


    loading.style.display =
        "block";

}


function hideLoading() {

    if (!loading) {
        return;
    }


    loading.style.display =
        "none";

}


// =====================================================
// ERROR
// =====================================================

function showError(message) {

    if (errorMessage) {

        errorMessage.textContent =
            message;


        errorMessage.style.display =
            "block";

        return;

    }


    if (showsContainer) {

        showsContainer.innerHTML = `

            <div class="error-state">

                <div>
                    ❌
                </div>

                <h3>
                    Something went wrong
                </h3>

                <p>
                    ${escapeHTML(message)}
                </p>

                <button
                    type="button"
                    class="book-show-btn"
                    onclick="loadMovie()"
                >
                    Try Again
                </button>

            </div>

        `;

    }

}


function hideError() {

    if (!errorMessage) {
        return;
    }


    errorMessage.style.display =
        "none";

}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        String(value);


    return div.innerHTML;

}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadMovie();

    }
);