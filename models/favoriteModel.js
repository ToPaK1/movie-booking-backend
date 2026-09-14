const db = require("../config/database");

const getFavoritesByUser = (userId) => db.prepare(`
    SELECT m.*,
           f.id AS favorite_id,
           f.created_at AS favorited_at
    FROM favorites f
    JOIN movies m ON m.id = f.movie_id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
`).all(userId);

const isFavorite = (userId, movieId) => Boolean(
    db.prepare("SELECT id FROM favorites WHERE user_id = ? AND movie_id = ?").get(userId, movieId)
);

const addFavorite = (userId, movieId) => db.prepare(`
    INSERT OR IGNORE INTO favorites (user_id, movie_id) VALUES (?, ?)
`).run(userId, movieId);

const removeFavorite = (userId, movieId) => db.prepare(
    "DELETE FROM favorites WHERE user_id = ? AND movie_id = ?"
).run(userId, movieId);

module.exports = { getFavoritesByUser, isFavorite, addFavorite, removeFavorite };
