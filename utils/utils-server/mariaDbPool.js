const { createPool } = require("mariadb");


let pool;

function getPool() {


    console.log('Get Pool is called! ----------------------------')

    if (!pool) {
    

        pool = createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
            connectionLimit: 10,
            timeout: 30000,
            supportBigNumbers: true,  // Support big numbers (e.g., DECIMAL)
             bigNumberStrings: false,   // Return big numbers as numbers, not strings,
             leakDetectionTimeout: 24000
        });


     
    }

    
    return pool;
}

module.exports = getPool;