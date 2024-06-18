const cron = require('node-cron');
const betterSqlite3 = require('better-sqlite3');

// Schedule the cron job to run every day at midnight
 function dbCleaner() {
  //every day
cron.schedule('0 0 * * *', async () => {
  console.log('Running the task to delete rows from the database...');


 //!!!!!!!!!!!!!! NAPOMENA !!!!!!!!!!!!!!! ORDER MI TREBAJU ZARAD IZRACUNAVANJA ADMIN STATISTIKA, TAKO DA NJIH
 //NE BRISATI. A MESSAGES NAMONTIRATI DA STIZU NA MEJL, A NA ADMIN SAMO DA SE PREUZIMAJU !!!!!!!!!!!!!!!!!!!!!!
 //rateLimiter data je ok da se brise.


const db = betterSqlite3(process.env.DB_PATH);



  const currUnixDateInDays = Math.floor(Date.now() / (86400000)) - 100;
  const currUnixDateInSeconds= (Math.floor(Date.now() / 1000));
  // const cleanOrdersQuery = `DELETE FROM orders WHERE ((packageStatus='2' OR packageStatus='3')  AND createdDate < ${currUnixDateInDays+33}) OR (approved='0' AND createdDate < ${currUnixDateInDays})`;
  // const cleanOrdersQuery = `DELETE FROM orders WHERE createdDate < ${currUnixDateInDays}`;
  // const cleanMessagesQuery = `DELETE FROM messages WHERE msgStatus = '2'`;
  const cleanRateLimiterQuery = `DELETE FROM rateLimiter WHERE expireDate < ${currUnixDateInSeconds}`;
  // 
  try {
    // Execute the delete query using run() method of better-sqlite3
    // db.exec(cleanOrdersQuery);
    // db.exec(cleanMessagesQuery);
    db.exec(cleanRateLimiterQuery);
    db.exec('VACUUM;');
    console.log('Rows deleted successfully!');
  } catch (error) {
    console.error('Error deleting rows:', error.message);
  }



db.on('error', (err) => {
  console.error('Database error:', err.message);
});

// Close the database connection when the Node.js process exits
process.on('exit', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing the database connection:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
});



});

}

module.exports = dbCleaner;