const mysql = require('mysql2');


// Create a pool to manage connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool so it can be used elsewhere in the application
module.exports = pool.promise();

// DB_HOST=localhost
// DB_USER=root
// DB_PASSWORD=your_password
// DB_DATABASE=your_database_name