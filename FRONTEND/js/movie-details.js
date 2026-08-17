const API_URL = "http://localhost:3000/api";

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error");
const movieDetails = document.getElementById("movieDetails");

const movieTitle = document.getElementById("movieTitle");
const movieGenre = document.getElementById("movieGenre");
const movieDescription = document.getElementById("movieDescription");
const movieDuration = document.getElementById("movieDuration");
const movieRating = document.getElementById("movieRating");
const movieReleaseDate = document.getElementById("movieReleaseDate");

const showsContainer = document.getElementById("showsContainer");


// Get movie ID from URL

const params = new URLSearchParams(window.location.search);

const movieId = params.get("id");


async function loadMovie() {

    if (!movieId) {

        showError();

        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/movies/${movieId}`
        );

        if (!response.ok) {
            throw new Error("Movie not found");
        }

        const movie = await response.json();

        displayMovie(movie);

        await loadShows();

    } catch (error) {

        console.error(error);

        showError();

    }

}


function displayMovie(movie) {

    loading.style.display = "none";

    movieDetails.style.display = "block";

    movieTitle.textContent =
        movie.title || "Unknown Movie";

    movieGenre.textContent =
        movie.genre || "Unknown Genre";

    movieDescription.textContent =
        movie.description ||
        "No description available.";

    movieDuration.textContent =
        movie.duration || "-";

    movieRating.textContent =
        movie.rating || "-";

    movieReleaseDate.textContent =
        movie.release_date || "-";

}


async function loadShows() {

    try {

        const response = await fetch(
            `${API_URL}/shows`
        );

        if (!response.ok) {
            throw new Error("Failed to load shows");
        }

        const shows = await response.json();

        const movieShows = shows.filter(
            show => String(show.movie_id) === String(movieId)
        );

        displayShows(movieShows);

    } catch (error) {

        console.error(error);

        showsContainer.innerHTML = `
            <div class="no-shows">
                Unable to load shows.
            </div>
        `;

    }

}


async function displayShows(shows) {

    showsContainer.innerHTML = "";

    if (shows.length === 0) {

        showsContainer.innerHTML = `
            <div class="no-shows">
                No shows available for this movie.
            </div>
        `;

        return;
    }


    // Get cinemas

    let cinemas = [];

    try {

        const response = await fetch(
            `${API_URL}/cinemas`
        );

        if (response.ok) {
            cinemas = await response.json();
        }

    } catch (error) {

        console.error(error);

    }


    shows.forEach(show => {

        const cinema = cinemas.find(
            item =>
                String(item.id) === String(show.cinema_id)
        );

        const cinemaName =
            cinema
                ? cinema.name
                : `Cinema #${show.cinema_id}`;

        const card = document.createElement("div");

        card.className = "show-card";

        card.innerHTML = `

            <div class="show-date">
                📅 ${show.show_date || "Date unavailable"}
            </div>

            <div class="show-time">
                🕐 ${show.show_time || "Time unavailable"}
            </div>

            <div class="show-cinema">
                🏢 ${cinemaName}
            </div>

            <div class="show-seats">
                🎟 ${show.available_seats || 0}
                seats available
            </div>

            <button
                class="book-btn"
                onclick="bookShow(${show.id})"
            >
                Book Now
            </button>

        `;

        showsContainer.appendChild(card);

    });

}


function bookShow(showId) {

    const token = localStorage.getItem("token");

    if (!token) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }

    window.location.href =
        `booking.html?show_id=${showId}`;

}


function showError() {

    loading.style.display = "none";

    movieDetails.style.display = "none";

    errorMessage.style.display = "block";

}


loadMovie();