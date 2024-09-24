const mariadb = require("mariadb");

const getConnection = async () => {
    
    
   
    
    console.log('WARNING! NEW CONNECTION INITIALIZATION! ----------------------------')
        
    
          const connection = await mariadb.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                port: process.env.DB_PORT,
                connectTimeout: 30000,
                supportBigNumbers: true,  // Support big numbers (e.g., DECIMAL)
                bigNumberStrings: false,   // Return big numbers as numbers, not strings
            });
       
            
    

    return connection;
};

module.exports = getConnection;