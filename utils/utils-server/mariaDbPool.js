const { createPool } = require("mariadb");







const getPool = ()=>{


    

    if (!global.pool) {
    
        console.log('Initializing new pool.')
        

        
        global.pool = createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
            connectionLimit: 10,
            timeout: 60000,
            acquireTimeout: 30000,
            supportBigNumbers: true,  // Support big numbers (e.g., DECIMAL)
             bigNumberStrings: false,   // Return big numbers as numbers, not strings,
             leakDetectionTimeout: 10000
        });


     
    }

    
    return pool;
}

module.exports = getPool;