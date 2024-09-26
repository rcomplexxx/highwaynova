
import { verifyToken } from "@/utils/utils-server/utils-admin/auth.js"; // Adjust the path based on your project structure
import RateLimiter from "@/utils/utils-server/rateLimiter.js";

import makeNewDescription from "@/utils/utils-server/makeNewDescription.js"
import reorderReviewsByRatingAndImages from '@/utils/utils-server/reorderReviews.jsx';



import insertInDb from '@/utils/utils-server/utils-admin/adminInsertDb'
import updateDb from '@/utils/utils-server/utils-admin/adminUpdateDb'
import getFromDb from '@/utils/utils-server/utils-admin/adminGetFromDb';
import wipeData from '@/utils/utils-server/utils-admin/adminDataWiper'
import deleteRow from '@/utils/utils-server/utils-admin/adminDbRowDeleter';
import obtainGetDbQueryParams from "@/utils/utils-server/utils-admin/obtainGetDbQueryParmas";


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

        

        
        if(dataType.startsWith("send_") && !data) return await resReturn(500, { successfulLogin: false, error: "No data to send" })

        console.log('data', data);
      

        

        if(dataType.startsWith("get_")){


         const {table, queryCondition, selectVariables} = obtainGetDbQueryParams(dataType);





        return await getFromDb(dbConnection, resReturn, 
          table,
          queryCondition,
          selectVariables
        ); 




        }
        

      else if (dataType.startsWith("send_")){


        

        if (dataType === "send_orders") {

         

          await updateDb(dbConnection, resReturn, "orders", data);
        } 

        else if (dataType === 'send_new_return'){

          
          await insertInDb(dbConnection,  resReturn,
            "product_returns",
            data
          );
          }
        
        
        
        else if (dataType === "send_unanswered_messages") {
        


          await updateDb(dbConnection, resReturn, "messages", data);
        } else if (dataType === "send_reviews") {


       
          

          await updateDb(dbConnection, resReturn, 
            "reviews",
            data
            
          );
         
        } 
        else if (dataType === "send_reviews_reorder") {


      


              const successfulReorder= await reorderReviewsByRatingAndImages(data.product_id, dbConnection);


          
             
             if(successfulReorder) return await resReturn(200, { success: true })
              else  return await resReturn(500, { success: false })
         
              
         
        } 
      
      

        else if(dataType=== "send_new_email_template"){

          await updateDb(dbConnection,  resReturn,
            "email_templates",
            data
          );

        }

        

    
        
        else if (dataType === "send_new_email") {
          console.log('started email send');
      
          

          await insertInDb(dbConnection,  resReturn,
            "emails",
            data
          );
        }


        else if (dataType === "send_email_data") {
          console.log('started email send');
     

           
          await updateDb(dbConnection,  resReturn,
            "emails",
            data
          );

        }
        
        else if(dataType==='send_new_sequence'){

     

          await insertInDb(dbConnection,  resReturn,
            "email_sequences",
            data
          );

        }
        
        
        else if(dataType === 'send_new_capaign'){
         
          

          await insertInDb(dbConnection,  resReturn,
            "email_campaigns",
            data
          );
        }


     

        else if(dataType === 'send_new_product_description'){

          
          console.log('send_new_product_description executed.');

    

          const newDescriptionIntegrated = await makeNewDescription(data.text , data.productId, dbConnection);

          if(!newDescriptionIntegrated) return await resReturn(500, { descriptionUpdated: false })





          //return true u res ako je uspesno revritowan fajl u kojem je smestena descripcija.
           return await resReturn(200, { descriptionUpdated: true })
         
             
            
     
           

         
        }


      }


      else if(dataType.startsWith('delete_')){


        
       if(dataType ==="delete_email_sequence")
          {
           deleteRow(dbConnection, resReturn, 'email_sequences', data.deleteId)
        
          
          }

          else if(dataType === "delete_email"){
            deleteRow(dbConnection, resReturn, 'emails', data.deleteId)
          }

          else if(dataType==="delete_product_return"){
            deleteRow(dbConnection, resReturn, 'product_returns', data.deleteId)
          }




      }


      else if(dataType.startsWith('wipe')){


        
        
         if(dataType === `wipe_orders`){
          wipeData(dbConnection,  resReturn,'orders')
        }
        else if(dataType === `wipe_messages`){
          wipeData(dbConnection,  resReturn,'messages')
        }
        else if(dataType === `wipe_reviews`){
          console.log('reviews wipiong', data.product_id)
          wipeData(dbConnection,  resReturn,'reviews', data.product_id)
        }
        else if(dataType ==="wipe_product_returns")
        wipeData(dbConnection,  resReturn,'product_returns')

        else if(dataType ==="wipe_emails")
          {
          wipeData(dbConnection,  resReturn,'emails')
          wipeData(dbConnection,  resReturn,'email_sequences')
          wipeData(dbConnection,  resReturn,'email_campaigns')
          }

        else if(dataType ==="wipe_email_sequences")
         {
          wipeData(dbConnection,  resReturn,'email_campaigns')
          wipeData(dbConnection,  resReturn,'email_sequences')
         
         }
        else if(dataType ==="wipe_email_campaigns")
          wipeData(dbConnection,  resReturn,'email_campaigns')

        else if(dataType ==="wipe_customers")
          wipeData(dbConnection,  resReturn,'customers')


        
      }

        




     

     
        
        else {
          console.error("Wrong data type");


          return await resReturn(500, { successfulLogin: false, error: "Wrong data type" })


          
        }
      
   
      

        console.log(' this shit should not be triggered')
        



  }
  
  
   catch (error) {
    console.error(error);

    return await resReturn(500, { successfulLogin: false, error: "Internal Server Error" })


 
    
  }

  finally{

    if(dbConnection) await dbConnection.release();
  }
} //
