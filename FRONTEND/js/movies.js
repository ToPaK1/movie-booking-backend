const API_URL = "http://localhost:3000/api";

// =====================================================
// DOM ELEMENTS
// =====================================================

const moviesContainer =
    document.getElementById("moviesContainer");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");

const searchInput =
    document.getElementById("searchInput");

const genreFilter =
    document.getElementById("genreFilter");


// =====================================================
// STATE
// =====================================================

let allMovies = [];


// =====================================================
// LOAD MOVIES
// =====================================================

async function loadMovies() {

    try {

        showLoading();

        hideError();

        const response = await fetch(
            `${API_URL}/movies`
        );


        if (!response.ok) {

            throw new Error(
                `Failed to load movies (${response.status})`
            );

        }


        const data =
            await response.json();


        // Support different API response formats
        if (Array.isArray(data)) {

            allMovies = data;

        } else if (Array.isArray(data.movies)) {

            allMovies = data.movies;

        } else if (Array.isArray(data.data)) {

            allMovies = data.data;

        } else {

            throw new Error(
                "Invalid movies response"
            );

        }


        populateGenres();

        displayMovies(allMovies);


    } catch (error) {

        console.error(
            "Error loading movies:",
            error
        );

        showError(
            "Unable to load movies. Please make sure the server is running."
        );

    } finally {

        hideLoading();

    }

}


// =====================================================
// DISPLAY MOVIES
// =====================================================

function displayMovies(movies) {

    if (!moviesContainer) {
        return;
    }


    moviesContainer.innerHTML = "";


    if (!movies || movies.length === 0) {

        moviesContainer.innerHTML = `

            <div class="no-movies">

                <div class="no-movies-icon">
                    🎬
                </div>

                <h3>
                    No movies found
                </h3>

                <p>
                    Try changing your search or genre filter.
                </p>

            </div>

        `;

        return;

    }


    movies.forEach((movie) => {

        const card =
            createMovieCard(movie);

        moviesContainer.appendChild(card);

        add3DEffect(card);

    });

}


// =====================================================
// CREATE MOVIE CARD
// =====================================================

function createMovieCard(movie) {

    const card =
        document.createElement("article");


    card.className =
        "movie-card";


    const movieId =
        movie.id;


    const title =
        escapeHTML(
            movie.title || "Untitled Movie"
        );


    const genre =
        escapeHTML(
            movie.genre || "Unknown"
        );


    const description =
        escapeHTML(
            movie.description ||
            "No description available."
        );


    const duration =
        movie.duration
            ? `${movie.duration} min`
            : "N/A";


    const rating =
        movie.rating !== null &&
        movie.rating !== undefined
            ? Number(movie.rating).toFixed(1)
            : "N/A";


    const poster =
        getPosterUrl(movie.poster);


    card.innerHTML = `

        <div class="movie-poster">

            <img
                src="${poster}"
                alt="${title}"
                class="movie-poster-image"
                onerror="this.onerror=null; this.src='images/movie-placeholder.svg';"
            >

            <div class="movie-rating">

                ⭐ ${rating}

            </div>

        </div>


        <div class="movie-info">

            <h3 class="movie-title">
                ${title}
            </h3>


            <div class="movie-meta">

                <span class="movie-genre">
                    ${genre}
                </span>

                <span class="movie-duration">
                    ${duration}
                </span>

            </div>


            <p class="movie-description">
                ${description}
            </p>


            <a
                href="movie-details.html?id=${encodeURIComponent(movieId)}"
                class="movie-btn"
            >
                View Details
            </a>

        </div>

    `;


    return card;

}


// =====================================================
// GET POSTER URL
// =====================================================

function getPosterUrl(poster) {

    if (!poster) {

        return "images/movie-placeholder.svg";

    }


    // Backend stores values such as:
    // /images/inception.jpg

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
// POPULATE GENRE FILTER
// =====================================================

function populateGenres() {

    if (!genreFilter) {
        return;
    }


    const genres =
        [
            ...new Set(
                allMovies
                    .map(movie => movie.genre)
                    .filter(Boolean)
            )
        ]
        .sort();


    genreFilter.innerHTML = `

        <option value="all">
            All Genres
        </option>

    `;


    genres.forEach((genre) => {

        const option =
            document.createElement("option");


        option.value =
            genre;


        option.textContent =
            genre;


        genreFilter.appendChild(option);

    });

}


// =====================================================
// FILTER MOVIES
// =====================================================

function filterMovies() {

    const searchValue =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedGenre =
        genreFilter
            ? genreFilter.value
            : "all";


    const filteredMovies =
        allMovies.filter((movie) => {

            const title =
                (movie.title || "")
                    .toLowerCase();


            const genre =
                (movie.genre || "")
                    .toLowerCase();


            const description =
                (movie.description || "")
                    .toLowerCase();


            const matchesSearch =
                !searchValue ||
                title.includes(searchValue) ||
                genre.includes(searchValue) ||
                description.includes(searchValue);


            const matchesGenre =
                selectedGenre === "all" ||
                movie.genre === selectedGenre;


            return (
                matchesSearch &&
                matchesGenre
            );

        });


    displayMovies(filteredMovies);

}


// =====================================================
// SEARCH EVENT
// =====================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterMovies
    );

}


// =====================================================
// GENRE EVENT
// =====================================================

if (genreFilter) {

    genreFilter.addEventListener(
        "change",
        filterMovies
    );

}


// =====================================================
// 3D CARD EFFECT
// =====================================================

function add3DEffect(card) {

    if (!card) {
        return;
    }


    card.addEventListener(
        "mousemove",
        (event) => {

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
                ((y - centerY) / centerY) * -5;


            const rotateY =
                ((x - centerX) / centerX) * 5;


            card.style.transform =
                `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-8px)
                scale(1.02)
                `;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform =
                `
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                translateY(0)
                scale(1)
                `;

        }
    );

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

    if (!errorMessage) {

        if (moviesContainer) {

            moviesContainer.innerHTML = `

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
                        onclick="loadMovies()"
                        class="movie-btn"
                    >
                        Try Again
                    </button>

                </div>

            `;

        }

        return;

    }


    errorMessage.textContent =
        message;


    errorMessage.style.display =
        "block";

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

        loadMovies();

    }
);