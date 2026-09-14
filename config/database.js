const Database = require("better-sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "../data/movie_booking.db");
const db = new Database(dbPath);
console.log("SQLite database connected successfully");
db.prepare(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,password TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'customer',phone TEXT)`).run();
console.log("Users table is ready");
const addColumnIfMissing=(table,column,definition)=>{const columns=db.prepare(`PRAGMA table_info(${table})`).all();if(!columns.some(c=>c.name===column))db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`).run();};
try{
 addColumnIfMissing("shows","ticket_price","REAL NOT NULL DEFAULT 120");
 addColumnIfMissing("bookings","selected_seats","TEXT NOT NULL DEFAULT '[]'");
 addColumnIfMissing("bookings","ticket_price","REAL NOT NULL DEFAULT 120");
 addColumnIfMissing("bookings","total_price","REAL NOT NULL DEFAULT 0");
 if(db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='shows'").get()){
  db.prepare("UPDATE shows SET ticket_price = CASE id WHEN 1 THEN 150 WHEN 2 THEN 170 WHEN 3 THEN 160 WHEN 4 THEN 180 WHEN 5 THEN 140 ELSE ticket_price END").run();
 }
}catch(error){console.log("Database migration note:",error.message);}
module.exports=db;