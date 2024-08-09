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
            host: 'sql7.freesqldatabase.com',
            user: 'sql7724818',
            password: 'nxPnr5hUPr',
            database: 'sql7724818',
            port: 3306,
            connectionLimit: 10,
        });
    }

    
    return pool;
}

module.exports = getPool;