
import reviewsData from "@/data/reviews.json";
import getConnection from "./mariaDbConnection";



export const getStartReviews= async(productId, limit = 20)=>{

  let dbConnection;


  try{
    dbConnection = await getConnection();
  

    
   
  
   

      console.log('in the reviews getter.')


  
     
      const result =  await dbConnection.query(`SELECT * FROM reviews WHERE product_id = ? ORDER BY id ASC LIMIT ?`, [productId, limit]);

      
  

  
  
      return result.length<limit?result.slice(0, limit):result;



      
    }

  
  catch(error){
    console.log('cant establish db connection',error);
  
    return reviewsData.slice(0,limit);
  }

  finally{
    if(dbConnection) await dbConnection.end();
  }


}