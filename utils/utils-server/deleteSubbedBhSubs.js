
const getPool = require('@/utils/utils-server/mariaDbPool');


// Ovaj program brise bh subscrajbere koji su se normalno subscribovali
 async function deleteSubbedBhSubs() {


 
let dbConnection = await getPool().getConnection();

  

  try {
    


   
    await dbConnection.query(
      `DELETE FROM customers WHERE subscribed = 0`);
  
    
    
    console.log('Rows deleted successfully!');
  } catch (error) {
    console.error('Error deleting rows:', error.message);
  }


  finally{
  if(dbConnection)await dbConnection.release();

  }




}

module.exports = deleteSubbedBhSubs;