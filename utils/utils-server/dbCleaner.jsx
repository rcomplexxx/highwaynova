const cron = require('node-cron');

const getPool = require('@/utils/utils-server/mariaDbPool');


// Schedule the cron job to run every day at midnight
 async function dbCleaner() {
  //every day
cron.schedule('0 0 * * *', async () => {
  console.log('Running the task to delete rows from the database...');


 //!!!!!!!!!!!!!! NAPOMENA !!!!!!!!!!!!!!! ORDER MI TREBAJU ZARAD IZRACUNAVANJA ADMIN STATISTIKA, TAKO DA NJIH
 //NE BRISATI. A MESSAGES NAMONTIRATI DA STIZU NA MEJL, A NA ADMIN SAMO DA SE PREUZIMAJU !!!!!!!!!!!!!!!!!!!!!!
 //rateLimiter data je ok da se brise.

 let dbConnection;





 
  
  // const cleanOrdersQuery = `DELETE FROM orders WHERE ((packageStatus=3 OR packageStatus=4)  AND createdDate < ${currUnixDateInDays+33}) OR (approved=0 AND createdDate < ${currUnixDateInDays})`;
  // const cleanOrdersQuery = `DELETE FROM orders WHERE createdDate < ${currUnixDateInDays}`;
  // const cleanMessagesQuery = `DELETE FROM messages WHERE msgStatus = 2`;

  
  // 
  try {
 
    dbConnection = await getPool().getConnection();

    await dbConnection.query(`DELETE FROM rateLimiter WHERE expireDate < ${Math.floor(Date.now() / 1000)}`);
    await dbConnection.query('OPTIMIZE TABLE rateLimiter');


    console.log('Rows deleted successfully!');
  } catch (error) {
    console.error('Error deleting rows:', error.message);
  }
  finally{
   if (dbConnection) await dbConnection.release();
  }







});

}

module.exports = dbCleaner;