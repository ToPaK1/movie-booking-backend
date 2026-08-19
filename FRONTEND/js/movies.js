const API_URL = "http://localhost:3000/api";

const moviesContainer =
    document.getElementById("moviesContainer");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");

const searchInput =
    document.getElementById("searchInput");

let allMovies = [];


// =====================================================
// LOAD MOVIES
// =====================================================

async function loadMovies() {

    try {

        loading.style.display = "block";
        error.style.display = "none";

        const response =
            await fetch(`${API_URL}/movies`);

        if (!response.ok) {
            throw new Error("Failed to load movies");
        }

        allMovies = await response.json();

        loading.style.display = "none";

        displayMovies(allMovies);

    } catch (err) {

        console.error(err);

        loading.style.display = "none";

        error.style.display = "block";

        error.textContent =
            "Unable to load movies. Make sure the server is running.";

    }

}


// =====================================================
// DISPLAY MOVIES
// =====================================================

function displayMovies(movies) {

    moviesContainer.innerHTML = "";


    if (movies.length === 0) {

        moviesContainer.innerHTML = `

            <div class="no-movies">

                <div class="empty-icon">
                    🎬
                </div>

                <h3>
                    No movies found
                </h3>

                <p>
                    Try searching for another movie.
                </p>

            </div>

        `;

        return;
    }


    movies.forEach((movie, index) => {

        const card =
            document.createElement("div");


        card.className =
            "movie-card";


        // Staggered animation

        card.style.animationDelay =
            `${index * 0.08}s`;


        // =================================================
        // MOVIE POSTER
        // =================================================

        let poster =
            movie.poster;


        // Fallback if backend does not have poster

        if (!poster) {

            const posterImages = {

                "Inception":
                    "images/inception.jpg",

                "The Dark Knight":
                    "images/dark-knight.jpg",

                "Interstellar":
                    "images/interstellar.jpg",

                "The Godfather":
                    "images/godfather.jpg"

            };


            poster =
                posterImages[movie.title] ||
                "images/default-movie.jpg";

        }


        // =================================================
        // CARD HTML
        // =================================================

        card.innerHTML = `

            <div class="movie-poster">

                <img
                    src="${poster}"
                    alt="${movie.title}"
                    onerror="
                        this.src='images/default-movie.jpg'
                    "
                >

                <div class="movie-rating">

                    ⭐ ${movie.rating || "N/A"}

                </div>

            </div>


            <div class="movie-card-content">

                <h3>
                    ${movie.title}
                </h3>


                <p class="movie-genre">

                    ${movie.genre || "Movie"}

                </p>


                <p class="movie-description">

                    ${
                        movie.description ||
                        "No description available."
                    }

                </p>


                <div class="movie-info">


                    <span>

                        ⏱
                        ${movie.duration || "-"}
                        min

                    </span>


                    <span>

                        📅
                        ${movie.release_date || "-"}

                    </span>


                </div>


                <button
                    class="view-movie-btn"
                    onclick="viewMovie(${movie.id})"
                >

                    View Details

                    <span>
                        →
                    </span>

                </button>


            </div>

        `;


        // Add card to page

        moviesContainer.appendChild(card);


        // Add 3D effect

        add3DEffect(card);

    });

}


// =====================================================
// 3D MOVIE CARD EFFECT
// =====================================================

function add3DEffect(card) {


    card.addEventListener(
        "mousemove",
        function (event) {


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


            // Rotation

            const rotateY =
                ((x - centerX) / centerX) * 7;


            const rotateX =
                ((centerY - y) / centerY) * 7;


            // Apply 3D transformation

            card.style.transform = `

                perspective(1000px)

                rotateX(${rotateX}deg)

                rotateY(${rotateY}deg)

                translateY(-8px)

                scale(1.02)

            `;


            // Move glow with mouse

            card.style.setProperty(
                "--mouse-x",
                `${x}px`
            );


            card.style.setProperty(
                "--mouse-y",
                `${y}px`
            );

        }
    );


    // Reset card

    card.addEventListener(
        "mouseleave",
        function () {

            card.style.transform = `

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
// SEARCH MOVIES
// =====================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {


            const search =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                allMovies.filter(movie => {


                    const title =
                        movie.title
                            ? movie.title.toLowerCase()
                            : "";


                    const genre =
                        movie.genre
                            ? movie.genre.toLowerCase()
                            : "";


                    const description =
                        movie.description
                            ? movie.description.toLowerCase()
                            : "";


                    return (

                        title.includes(search) ||

                        genre.includes(search) ||

                        description.includes(search)

                    );

                });


            displayMovies(filtered);

        }
    );

}


// =====================================================
// VIEW MOVIE DETAILS
// =====================================================

function viewMovie(id) {

    window.location.href =
        `movie-details.html?id=${id}`;

}


// =====================================================
// START
// =====================================================

loadMovies();