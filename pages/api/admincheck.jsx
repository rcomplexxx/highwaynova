
import { verifyToken } from "@/utils/utils-server/utils-admin/auth.js"; // Adjust the path based on your project structure
import RateLimiter from "@/utils/utils-server/rateLimiter.js";

import makeNewDescription from "@/utils/utils-server/makeNewDescription.js"
import reorderReviewsByRatingAndImages from '@/utils/utils-server/reorderReviews.jsx';



import insertInDb from '@/utils/utils-server/utils-admin/adminInsertDb'
import updateDb from '@/utils/utils-server/utils-admin/adminUpdateDb'
import getFromDb from '@/utils/utils-server/utils-admin/adminGetFromDb';
import wipeData from '@/utils/utils-server/utils-admin/adminDataWiper'
import deleteRow from '@/utils/utils-server/utils-admin/adminDbRowDeleter';
import {obtainGetDbQueryParams} from "@/utils/utils-server/utils-admin/obtainAdminDbQueryParmas";


const getPool = require('@/utils/utils-server/mariaDbPool');


const limiterPerTwoMins = new RateLimiter({
  apiNumberArg: 6,
  tokenNumberArg: 40,
  expireDurationArg: 120, //secs
});

export default async function adminCheckHandler(req, res) {
  const { token } = req.cookies;




let dbConnection;


  const resReturn = async(statusNumber, jsonObject)=>{

    


    res.status(statusNumber).json(jsonObject)

 }








  






 






  

  try {


    
    dbConnection = await getPool().getConnection()


    // const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    // if (!(await limiterPerTwoMins.rateLimiterGate(clientIp, dbConnection))) return await resReturn(429, { error: "Too many requests." })
   


    

      
      
    if (!verifyToken(token))  return await resReturn(400, { successfulLogin: false,
        error: "You do not have access to this sector. Unable to hack, amateur ;).", })



    
      const { dataType, data } = req.body;
     
     
      
      if (!dataType) return await resReturn(200, { successfulLogin: true })

        

        
        

        console.log('data', data);

        
        if(!data && (dataType.startsWith("insert_") || dataType.startsWith("update_") || dataType.startsWith("delete_"))) return await resReturn(500, { successfulLogin: false, error: "No data to send" })
      

        

        if(dataType.startsWith("get_")){


         const {table, queryCondition, selectVariables} = obtainGetDbQueryParams(dataType, data);
        return await getFromDb(dbConnection, resReturn, table, queryCondition, selectVariables ); 




        }
        

      else if (dataType.startsWith("update_")){





          let table;

        if (dataType === "update_orders")  table = "orders";
    
        else if (dataType === "update_unanswered_messages")   table = "messages";

         else if (dataType === "update_reviews") table = "reviews";

  
         else if(dataType=== "update_new_email_template")  table = "email_templates";

     
     
         else if (dataType === "update_email_data") {

          console.log('started email send');
     
          table = "emails";
           

        }

        if(table) return await updateDb(dbConnection, resReturn, table, data);
 
         





        else {
      

       if (dataType === "update_reviews_reorder") {



          const successfulReorder= await reorderReviewsByRatingAndImages(data.product_id, dbConnection);
         if(successfulReorder) return await resReturn(200, { success: true })
          else  return await resReturn(500, { success: false })
     
          
     
    } 
     

        else if(dataType === 'update_new_product_description'){

          
          console.log('update_new_product_description executed.');

    

          const newDescriptionIntegrated = await makeNewDescription(data.text , data.productId, dbConnection);

          if(!newDescriptionIntegrated) return await resReturn(500, { descriptionUpdated: false })





          //return true u res ako je uspesno revritowan fajl u kojem je smestena descripcija.
           return await resReturn(200, { descriptionUpdated: true })
         
             
            
     
         
        }
        else{
        return await resReturn(500, { successfulLogin: false, error: "Wrong data type" })
        }

        }





      }



      else if(dataType.startsWith('insert_')){

        let table;

        if (dataType === 'insert_new_return') table = "product_returns";

          
      

        else if (dataType === "insert_new_email")  table = "emails";

        else if(dataType==='insert_new_sequence') table = "email_sequences";

       
        
        else if(dataType === 'insert_new_capaign') table = "email_campaigns";

        else return await resReturn(500, { successfulLogin: false, error: "Wrong data type" })

        


        
        return await insertInDb(dbConnection,  resReturn, table, data);




      }






      else if(dataType.startsWith('delete_')){

        let table;
        
       if(dataType ==="delete_email_sequence") table = 'email_sequences';
      
       

          else if(dataType === "delete_email")table = 'emails';
      
          

          else if(dataType==="delete_product_return")table = 'product_returns';

          else return await resReturn(500, { successfulLogin: false, error: "Wrong data type" })
       

         return await deleteRow(dbConnection, resReturn, table, data.deleteId)


      }


      else if(dataType.startsWith('wipe')){


        let table; 
        
        
         if(dataType === `wipe_orders`) table= 'orders';
        
        else if(dataType === `wipe_messages`) table= 'messages';
          
  


        else if(dataType ==="wipe_product_returns") table= 'product_returns';
        

        else if(dataType ==="wipe_emails")  table= 'emails';
        
        

        else if(dataType ==="wipe_email_sequences") table= 'email_sequences';
      
        
        else if(dataType ==="wipe_email_campaigns")  table= 'email_campaigns';
        

        else if(dataType ==="wipe_customers") table= 'customers';

        else if(dataType === `wipe_reviews`){
          console.log('reviews wiping', data.product_id)
          return await wipeData(dbConnection,  resReturn,'reviews', data.product_id)
        }



        
        if(table) return await wipeData(dbConnection, resReturn, table);

        

        else return await resReturn(500, { successfulLogin: false, error: "Wrong data type" })

        

      }


     

     
        
        else {
          console.error("Wrong data type");


          return await resReturn(500, { successfulLogin: false, error: "Wrong data type" })


          
        }
      
   
      

        
        



  }
  
  
   catch (error) {
    console.error('error in admin check api', error);

    return await resReturn(500, { successfulLogin: false, error: "Internal Server Error" })


 
    
  }

  finally{

    if(dbConnection) await dbConnection.release();
  }
} //
