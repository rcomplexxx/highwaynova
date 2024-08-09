const { createPool } = require("mariadb");


let pool;

function getPool() {
    if (!pool) {
    

        // pool = createPool({
        //     host: process.env.DB_HOST,
        //     user: process.env.DB_USER,
        //     password: process.env.DB_PASSWORD,
        //     database: process.env.DB_DATABASE,
        //     port: process.env.DB_PORT,
        //     connectionLimit: 10,
        // });


        pool = createPool({
            host: 'nga.h.filess.io',
            user: 'mariadatabase_northhold',
            password: '2e13626b40d1ae7082b56dc61cecc02b6e95b905',
            database: 'mariadatabase_northhold',
            port: 3305,
            connectionLimit: 10,
        });
    }

    
    return pool;
}

module.exports = getPool;