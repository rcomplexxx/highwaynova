const betterSqlite3 = require('better-sqlite3');

// Ovaj program brise bh subscrajbere koji su se normalno subscribovali
 function deleteSubbedBhSubs() {


 


// Open a database connection (or create a new one if the file does not exist)
const db = betterSqlite3(process.env.DB_PATH);



  // Your SQL query to delete rows (for example, delete rows older than a certain date)

  try {
    // Execute the delete query using run() method of better-sqlite3

   
    db.prepare(
      `DELETE FROM customers WHERE subscribed = false`).run(
    
    );
  
    
    
    console.log('Rows deleted successfully!');
  } catch (error) {
    console.error('Error deleting rows:', error.message);
  }


  db.close((err) => {
    if (err) {
      console.error('Error closing the database connection:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });




}

module.exports = deleteSubbedBhSubs;