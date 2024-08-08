
import reviewsData from "@/data/reviews.json";
const getPool = require('./mariaDbPool');


export const getReviewsData= async(productId)=>{
const limit = 20;

    try {
   
  
   



     let dbConnection = await getPool().getConnection();
  
     
      const result =  await dbConnection.query(`SELECT * FROM reviews WHERE product_id = ? LIMIT ?`, [productId, limit]);
  

  
      await dbConnection.release();
  
      return result.length<20?reviewsData:result;
    } catch (error) {
     return reviewsData;
    }
}