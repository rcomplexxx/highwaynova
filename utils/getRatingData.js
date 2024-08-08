
const getPool = require('./mariaDbPool');

const getRatingData = async(product_id, stars) => {
 

  try {
  

    let dbConnection = await getPool().getConnection();

 

   
    
    const result = parseInt((await dbConnection.query(`SELECT COUNT(*) as count FROM reviews WHERE product_id = ? AND stars = ?`, [product_id, stars]))[0].count);

   
   
    await dbConnection.release()
    
    return Number(result);
  } catch (error) {

   return 0;
  }
};

export default getRatingData;



