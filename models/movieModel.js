const db = require("../config/database");

const getAllMovies=()=>db.prepare(`SELECT * FROM movies ORDER BY id DESC`).all();
const getMovieById=(id)=>db.prepare(`SELECT * FROM movies WHERE id = ?`).get(id);
const createMovie=(movie)=>{const {title,description,genre,duration,release_date,rating,poster}=movie;return db.prepare(`INSERT INTO movies (title,description,genre,duration,release_date,rating,poster) VALUES (?,?,?,?,?,?,?)`).run(title,description,genre,duration,release_date,rating,poster);};
const updateMovie=(id,movie)=>{const {title,description,genre,duration,release_date,rating,poster}=movie;return db.prepare(`UPDATE movies SET title=?,description=?,genre=?,duration=?,release_date=?,rating=?,poster=? WHERE id=?`).run(title,description,genre,duration,release_date,rating,poster,id);};
const deleteMovie=(id)=>db.prepare(`DELETE FROM movies WHERE id=?`).run(id);
module.exports={getAllMovies,getMovieById,createMovie,updateMovie,deleteMovie};
