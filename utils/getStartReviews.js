
import reviewsData from "@/data/reviews.json";
const getPool = require('./mariaDbPool');


export const getStartReviews= async(productId, limit = 20)=>{


  try{
    let dbConnection = await (await getPool()).getConnection();
  


    try {
   
  
   

      console.log('in the reviews getter.')


  
     
      const result =  await dbConnection.query(`SELECT * FROM reviews WHERE product_id = ? LIMIT ?`, [productId, limit]);

      console.log('here is result', result)
  

  
      await dbConnection.release();
  
      return result.length<limit?result.slice(0, limit):result;
    } catch (error) {
      console.log('cant pick up reviews with main function.', error)
      await dbConnection.release();
     return reviewsData.slice(0,limit);
    }

  }
  catch(e){
    console.log('cant establish db connection')
  }


}