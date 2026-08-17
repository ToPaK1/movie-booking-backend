const API_URL = "http://localhost:3000/api";

const moviesContainer = document.getElementById("moviesContainer");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error");
const searchInput = document.getElementById("searchInput");

let movies = [];


async function getMovies() {

    try {

        loading.style.display = "block";
        errorMessage.style.display = "none";

        const response = await fetch(`${API_URL}/movies`);

        if (!response.ok) {
            throw new Error("Failed to fetch movies");
        }

        movies = await response.json();

        loading.style.display = "none";

        displayMovies(movies);

    } catch (error) {

        console.error(error);

        loading.style.display = "none";
        errorMessage.style.display = "block";

        moviesContainer.innerHTML = "";
    }
}


function displayMovies(movieList) {

    moviesContainer.innerHTML = "";

    if (movieList.length === 0) {

        moviesContainer.innerHTML = `
            <div class="loading">
                No movies found.
            </div>
        `;

        return;
    }


    movieList.forEach(movie => {

        const card = document.createElement("div");

        card.className = "movie-card";

        card.innerHTML = `

            <div class="movie-poster">
                🎬
            </div>

            <div class="movie-info">

                <h3>
                    ${movie.title}
                </h3>

                <div class="movie-genre">
                    ${movie.genre || "Unknown Genre"}
                </div>

                <p class="movie-description">
                    ${movie.description || "No description available."}
                </p>

                <div class="movie-meta">

                    <span>
                        ⏱ ${movie.duration || "N/A"} min
                    </span>

                    <span class="movie-rating">
                        ⭐ ${movie.rating || "N/A"}
                    </span>

                </div>

                <a
                    href="movie-details.html?id=${movie.id}"
                    class="movie-btn"
                >
                    View Details
                </a>

            </div>
        `;

        moviesContainer.appendChild(card);

    });
}


searchInput.addEventListener("input", () => {

    const searchTerm =
        searchInput.value.toLowerCase().trim();

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm) ||
        (movie.genre &&
            movie.genre.toLowerCase().includes(searchTerm))
    );

    displayMovies(filteredMovies);

});


getMovies();