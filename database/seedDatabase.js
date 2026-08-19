const db = require("../config/database");
const bcrypt = require("bcryptjs");

console.log("🌱 Starting database seeding...");

try {

    // =====================================================
    // ENABLE FOREIGN KEYS
    // =====================================================

    db.pragma("foreign_keys = ON");


    // =====================================================
    // CLEAR OLD DATA
    // =====================================================

    console.log("🧹 Clearing old seed data...");

    db.prepare("DELETE FROM bookings").run();
    db.prepare("DELETE FROM shows").run();
    db.prepare("DELETE FROM movies").run();
    db.prepare("DELETE FROM cinemas").run();


    // =====================================================
    // USERS
    // =====================================================

    console.log("👥 Creating users...");

    const adminPassword =
        bcrypt.hashSync("admin123", 10);

    const customerPassword =
        bcrypt.hashSync("123456", 10);


    const insertUser = db.prepare(`
        INSERT OR IGNORE INTO users
        (
            name,
            email,
            password,
            role,
            phone
        )
        VALUES
        (
            @name,
            @email,
            @password,
            @role,
            @phone
        )
    `);


    insertUser.run({
        name: "Cinema Admin",
        email: "admin@cinebook.com",
        password: adminPassword,
        role: "admin",
        phone: "01000000000"
    });


    insertUser.run({
        name: "Ahmed Mohamed",
        email: "ahmed@gmail.com",
        password: customerPassword,
        role: "customer",
        phone: "01011111111"
    });


    insertUser.run({
        name: "Sara Ali",
        email: "sara@gmail.com",
        password: customerPassword,
        role: "customer",
        phone: "01122222222"
    });


    insertUser.run({
        name: "Omar Hassan",
        email: "omar@gmail.com",
        password: customerPassword,
        role: "customer",
        phone: "01233333333"
    });


    insertUser.run({
        name: "Mariam Samir",
        email: "mariam@gmail.com",
        password: customerPassword,
        role: "customer",
        phone: "01544444444"
    });


    // =====================================================
    // MOVIES
    // =====================================================

    console.log("🎬 Creating movies...");


    const insertMovie = db.prepare(`
        INSERT INTO movies
        (
            title,
            genre,
            duration,
            rating,
            release_date,
            description,
            poster
        )
        VALUES
        (
            @title,
            @genre,
            @duration,
            @rating,
            @release_date,
            @description,
            @poster
        )
    `);


    const movies = [

        {
            title: "Interstellar",
            genre: "Sci-Fi",
            duration: 169,
            rating: 8.7,
            release_date: "2014-11-07",
            description:
                "A team of explorers travels through a wormhole in space in search of a new home for humanity.",
            poster: "images/interstellar.jpg"
        },

        {
            title: "Inception",
            genre: "Sci-Fi",
            duration: 148,
            rating: 8.8,
            release_date: "2010-07-16",
            description:
                "A skilled thief who steals secrets through dreams is given a chance to erase his past by performing an impossible task.",
            poster: "images/inception.jpg"
        },

        {
            title: "The Dark Knight",
            genre: "Action",
            duration: 152,
            rating: 9.0,
            release_date: "2008-07-18",
            description:
                "Batman faces the Joker, a criminal mastermind who plunges Gotham City into chaos.",
            poster: "images/dark-knight.jpg"
        },

        {
            title: "The Godfather",
            genre: "Crime",
            duration: 175,
            rating: 9.2,
            release_date: "1972-03-24",
            description:
                "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.",
            poster: "images/godfather.jpg"
        },

        {
            title: "Avengers: Endgame",
            genre: "Action",
            duration: 181,
            rating: 8.4,
            release_date: "2019-04-26",
            description:
                "The Avengers assemble once again to reverse the devastating consequences of Thanos.",
            poster: "images/avengers-endgame.jpg"
        },

        {
            title: "The Matrix",
            genre: "Sci-Fi",
            duration: 136,
            rating: 8.7,
            release_date: "1999-03-31",
            description:
                "A computer hacker discovers that reality is not what it seems and joins a rebellion against intelligent machines.",
            poster: "images/the-matrix.jpg"
        },

        {
            title: "Gladiator",
            genre: "Action",
            duration: 155,
            rating: 8.5,
            release_date: "2000-05-05",
            description:
                "A betrayed Roman general fights his way back from slavery to seek revenge against the emperor who destroyed his family.",
            poster: "images/gladiator.jpg"
        },

        {
            title: "Parasite",
            genre: "Drama",
            duration: 132,
            rating: 8.5,
            release_date: "2019-05-30",
            description:
                "A struggling family slowly becomes involved with a wealthy household in an unexpected and dangerous way.",
            poster: "images/parasite.jpg"
        },

        {
            title: "Spider-Man: No Way Home",
            genre: "Action",
            duration: 148,
            rating: 8.2,
            release_date: "2021-12-17",
            description:
                "Spider-Man faces villains from different realities after a spell causes the multiverse to open.",
            poster: "images/spiderman.jpg"
        },

        {
            title: "The Shawshank Redemption",
            genre: "Drama",
            duration: 142,
            rating: 9.3,
            release_date: "1994-09-23",
            description:
                "Two imprisoned men form a powerful friendship while searching for hope and redemption.",
            poster: "images/shawshank.jpg"
        }

    ];


    const movieIds = [];


    for (const movie of movies) {

        const result =
            insertMovie.run(movie);

        movieIds.push(
            result.lastInsertRowid
        );

    }


    console.log(
        `✅ ${movieIds.length} movies created`
    );


    // =====================================================
    // CINEMAS
    // =====================================================

    console.log("🏢 Creating cinemas...");


    const insertCinema = db.prepare(`
        INSERT INTO cinemas
        (
            name,
            location,
            total_seats
        )
        VALUES
        (
            @name,
            @location,
            @total_seats
        )
    `);


    const cinemas = [

        {
            name: "CineBook Downtown",
            location: "Downtown Cairo",
            total_seats: 120
        },

        {
            name: "CineBook City Center",
            location: "Nasr City",
            total_seats: 150
        },

        {
            name: "CineBook Mall",
            location: "New Cairo",
            total_seats: 180
        },

        {
            name: "CineBook Plaza",
            location: "6th of October",
            total_seats: 140
        },

        {
            name: "CineBook Cinema",
            location: "Maadi",
            total_seats: 100
        }

    ];


    const cinemaIds = [];


    for (const cinema of cinemas) {

        const result =
            insertCinema.run(cinema);

        cinemaIds.push(
            result.lastInsertRowid
        );

    }


    console.log(
        `✅ ${cinemaIds.length} cinemas created`
    );


    // =====================================================
    // SHOWS
    // =====================================================

    console.log("🎭 Creating shows...");


    const insertShow = db.prepare(`
        INSERT INTO shows
        (
            movie_id,
            cinema_id,
            show_date,
            show_time,
            available_seats
        )
        VALUES
        (
            @movie_id,
            @cinema_id,
            @show_date,
            @show_time,
            @available_seats
        )
    `);


    const shows = [

        // INTERSTELLAR

        {
            movie_id: movieIds[0],
            cinema_id: cinemaIds[0],
            show_date: "2026-08-20",
            show_time: "17:00",
            available_seats: 80
        },

        {
            movie_id: movieIds[0],
            cinema_id: cinemaIds[1],
            show_date: "2026-08-20",
            show_time: "20:30",
            available_seats: 75
        },


        // INCEPTION

        {
            movie_id: movieIds[1],
            cinema_id: cinemaIds[0],
            show_date: "2026-08-20",
            show_time: "18:00",
            available_seats: 70
        },

        {
            movie_id: movieIds[1],
            cinema_id: cinemaIds[2],
            show_date: "2026-08-21",
            show_time: "21:00",
            available_seats: 90
        },


        // DARK KNIGHT

        {
            movie_id: movieIds[2],
            cinema_id: cinemaIds[1],
            show_date: "2026-08-20",
            show_time: "19:00",
            available_seats: 65
        },

        {
            movie_id: movieIds[2],
            cinema_id: cinemaIds[3],
            show_date: "2026-08-21",
            show_time: "22:00",
            available_seats: 85
        },


        // GODFATHER

        {
            movie_id: movieIds[3],
            cinema_id: cinemaIds[0],
            show_date: "2026-08-21",
            show_time: "17:30",
            available_seats: 60
        },

        {
            movie_id: movieIds[3],
            cinema_id: cinemaIds[4],
            show_date: "2026-08-22",
            show_time: "20:00",
            available_seats: 75
        },


        // AVENGERS

        {
            movie_id: movieIds[4],
            cinema_id: cinemaIds[2],
            show_date: "2026-08-20",
            show_time: "16:00",
            available_seats: 100
        },

        {
            movie_id: movieIds[4],
            cinema_id: cinemaIds[3],
            show_date: "2026-08-21",
            show_time: "19:30",
            available_seats: 95
        },


        // MATRIX

        {
            movie_id: movieIds[5],
            cinema_id: cinemaIds[1],
            show_date: "2026-08-22",
            show_time: "18:30",
            available_seats: 70
        },


        // GLADIATOR

        {
            movie_id: movieIds[6],
            cinema_id: cinemaIds[4],
            show_date: "2026-08-22",
            show_time: "21:00",
            available_seats: 80
        },


        // PARASITE

        {
            movie_id: movieIds[7],
            cinema_id: cinemaIds[2],
            show_date: "2026-08-23",
            show_time: "17:00",
            available_seats: 65
        },


        // SPIDER-MAN

        {
            movie_id: movieIds[8],
            cinema_id: cinemaIds[3],
            show_date: "2026-08-23",
            show_time: "20:00",
            available_seats: 100
        },


        // SHAWSHANK

        {
            movie_id: movieIds[9],
            cinema_id: cinemaIds[0],
            show_date: "2026-08-24",
            show_time: "19:00",
            available_seats: 75
        }

    ];


    const showIds = [];


    for (const show of shows) {

        const result =
            insertShow.run(show);

        showIds.push(
            result.lastInsertRowid
        );

    }


    console.log(
        `✅ ${showIds.length} shows created`
    );


    // =====================================================
    // BOOKINGS
    // =====================================================

    console.log("🎟️ Creating sample bookings...");


    const getUser =
        db.prepare(`
            SELECT id
            FROM users
            WHERE email = ?
        `);


    const ahmed =
        getUser.get("ahmed@gmail.com");

    const sara =
        getUser.get("sara@gmail.com");

    const omar =
        getUser.get("omar@gmail.com");

    const mariam =
        getUser.get("mariam@gmail.com");


    // =====================================================
    // CHECK BOOKING COLUMNS
    // =====================================================

    const bookingColumns =
        db.prepare(`
            PRAGMA table_info(bookings)
        `).all();


    const columnNames =
        bookingColumns.map(
            column => column.name
        );


    console.log(
        "📋 Booking columns:",
        columnNames.join(", ")
    );


    const hasUserId =
        columnNames.includes("user_id");

    const hasShowId =
        columnNames.includes("show_id");

    const hasSeats =
        columnNames.includes("seats");

    const hasNumberOfSeats =
        columnNames.includes("number_of_seats");

    const hasStatus =
        columnNames.includes("status");

    const hasBookingDate =
        columnNames.includes("booking_date");


    // =====================================================
    // INSERT BOOKINGS
    // =====================================================

    if (hasUserId && hasShowId) {

        let insertBookingSQL = null;


        if (
            hasSeats &&
            hasStatus &&
            hasBookingDate
        ) {

            insertBookingSQL = `
                INSERT INTO bookings
                (
                    user_id,
                    show_id,
                    seats,
                    status,
                    booking_date
                )
                VALUES
                (
                    @user_id,
                    @show_id,
                    @seats,
                    @status,
                    @booking_date
                )
            `;

        } else if (
            hasNumberOfSeats &&
            hasStatus &&
            hasBookingDate
        ) {

            insertBookingSQL = `
                INSERT INTO bookings
                (
                    user_id,
                    show_id,
                    number_of_seats,
                    status,
                    booking_date
                )
                VALUES
                (
                    @user_id,
                    @show_id,
                    @number_of_seats,
                    @status,
                    @booking_date
                )
            `;

        } else if (
            hasSeats &&
            hasStatus
        ) {

            insertBookingSQL = `
                INSERT INTO bookings
                (
                    user_id,
                    show_id,
                    seats,
                    status
                )
                VALUES
                (
                    @user_id,
                    @show_id,
                    @seats,
                    @status
                )
            `;

        } else if (
            hasNumberOfSeats &&
            hasStatus
        ) {

            insertBookingSQL = `
                INSERT INTO bookings
                (
                    user_id,
                    show_id,
                    number_of_seats,
                    status
                )
                VALUES
                (
                    @user_id,
                    @show_id,
                    @number_of_seats,
                    @status
                )
            `;

        } else if (hasSeats) {

            insertBookingSQL = `
                INSERT INTO bookings
                (
                    user_id,
                    show_id,
                    seats
                )
                VALUES
                (
                    @user_id,
                    @show_id,
                    @seats
                )
            `;

        } else if (hasNumberOfSeats) {

            insertBookingSQL = `
                INSERT INTO bookings
                (
                    user_id,
                    show_id,
                    number_of_seats
                )
                VALUES
                (
                    @user_id,
                    @show_id,
                    @number_of_seats
                )
            `;

        }


        if (insertBookingSQL) {

            const insertBooking =
                db.prepare(
                    insertBookingSQL
                );


            const bookingData = [];


            if (ahmed) {

                bookingData.push({
                    user_id: ahmed.id,
                    show_id: showIds[0],
                    seats: 2,
                    number_of_seats: 2,
                    status: "confirmed",
                    booking_date: "2026-08-19"
                });

            }


            if (sara) {

                bookingData.push({
                    user_id: sara.id,
                    show_id: showIds[2],
                    seats: 3,
                    number_of_seats: 3,
                    status: "confirmed",
                    booking_date: "2026-08-19"
                });

            }


            if (omar) {

                bookingData.push({
                    user_id: omar.id,
                    show_id: showIds[4],
                    seats: 1,
                    number_of_seats: 1,
                    status: "confirmed",
                    booking_date: "2026-08-19"
                });

            }


            if (mariam) {

                bookingData.push({
                    user_id: mariam.id,
                    show_id: showIds[8],
                    seats: 4,
                    number_of_seats: 4,
                    status: "confirmed",
                    booking_date: "2026-08-19"
                });

            }


            for (
                const booking of bookingData
            ) {

                insertBooking.run(
                    booking
                );

            }


            console.log(
                `✅ ${bookingData.length} bookings created`
            );

        } else {

            console.log(
                "⚠️ Could not determine bookings schema."
            );

            console.log(
                "⚠️ Bookings were skipped."
            );

        }

    } else {

        console.log(
            "⚠️ bookings table does not contain user_id/show_id."
        );

        console.log(
            "⚠️ Bookings were skipped."
        );

    }


    // =====================================================
    // UPDATE AVAILABLE SEATS
    // =====================================================

    console.log(
        "💺 Updating available seats..."
    );


    const updateSeats =
        db.prepare(`
            UPDATE shows
            SET available_seats = ?
            WHERE id = ?
        `);


    updateSeats.run(
        78,
        showIds[0]
    );


    updateSeats.run(
        67,
        showIds[2]
    );


    updateSeats.run(
        64,
        showIds[4]
    );


    updateSeats.run(
        96,
        showIds[8]
    );


    // =====================================================
    // FINAL SUMMARY
    // =====================================================

    console.log("");
    console.log("========================================");
    console.log("🎉 DATABASE SEEDING COMPLETED!");
    console.log("========================================");


    const movieCount =
        db.prepare(
            "SELECT COUNT(*) AS count FROM movies"
        ).get().count;


    const cinemaCount =
        db.prepare(
            "SELECT COUNT(*) AS count FROM cinemas"
        ).get().count;


    const showCount =
        db.prepare(
            "SELECT COUNT(*) AS count FROM shows"
        ).get().count;


    const userCount =
        db.prepare(
            "SELECT COUNT(*) AS count FROM users"
        ).get().count;


    const bookingCount =
        db.prepare(
            "SELECT COUNT(*) AS count FROM bookings"
        ).get().count;


    console.log(
        `👥 Users:    ${userCount}`
    );

    console.log(
        `🎬 Movies:   ${movieCount}`
    );

    console.log(
        `🏢 Cinemas:  ${cinemaCount}`
    );

    console.log(
        `🎭 Shows:    ${showCount}`
    );

    console.log(
        `🎟️ Bookings: ${bookingCount}`
    );


    console.log("");
    console.log("🔐 TEST ACCOUNTS");
    console.log("----------------------------------------");

    console.log(
        "Admin:"
    );

    console.log(
        "Email: admin@cinebook.com"
    );

    console.log(
        "Password: admin123"
    );

    console.log("");

    console.log(
        "Customer:"
    );

    console.log(
        "Email: ahmed@gmail.com"
    );

    console.log(
        "Password: 123456"
    );

    console.log("========================================");


} catch (error) {

    console.error("");
    console.error(
        "❌ SEEDING FAILED"
    );

    console.error(error);

}