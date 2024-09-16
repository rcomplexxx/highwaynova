
import reviewsData from "@/data/reviews.json";
const getPool = require('@/utils/utils-server/mariaDbPool');


export const getStartReviews= async(productId, limit = 20)=>{

  let dbConnection;


  try{
    dbConnection = await getPool().getConnection();
  

    
   
  
   

      console.log('in the reviews getter.')


  
     
      const result =  await dbConnection.query(`SELECT * FROM reviews WHERE product_id = ? LIMIT ?`, [productId, limit]);

      console.log('here is result', result)
  

  
  
      return result.length<limit?result.slice(0, limit):result;



      
    }

  
  catch(error){
    console.log('cant establish db connection',error);
  
    return reviewsData.slice(0,limit);
  }

  finally{
    if(dbConnection) await dbConnection.release();
  }


}