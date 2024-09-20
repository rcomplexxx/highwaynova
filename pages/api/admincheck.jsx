
import { verifyToken } from "@/utils/utils-server/auth.js"; // Adjust the path based on your project structure
import RateLimiter from "@/utils/utils-server/rateLimiter.js";

import makeNewDescription from "@/utils/utils-server/makeNewDescription.js"
import reorderReviewsByRatingAndImages from '@/utils/utils-server/reorderReviews.jsx';



import updateDb from '@/utils/utils-server/utils-admin/adminUpdateDb'
import getFromDb from '@/utils/utils-server/utils-admin/adminGetFromDb';
import wipeData from '@/utils/utils-server/utils-admin/adminDataWiper'
import deleteRow from '@/utils/utils-server/utils-admin/adminDbRowDeleter';


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

    console.log('returning res', statusNumber, jsonObject);


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
      

        

        
        


          // await dbConnection.query(`SELECT orders.*, customers.email FROM orders JOIN customers ON orders.customer_id = customers.id WHERE approved = 0 ORDER BY orders.createdDate DESC`)

        if(dataType === "get_order_cash_info")  await getFromDb(dbConnection, resReturn, "orders", `approved = 1`, "createdDate, total, supplyCost, tip, couponCode");
        //Ovde approved
        else if(dataType === "get_order_cash_info_only_fulfilled_orders") await getFromDb(dbConnection, resReturn, "orders", `packageStatus != 0`, "createdDate, total, supplyCost, tip, couponCode");
        else if (dataType === "get_unfulfilled_orders")
          await getFromDb(dbConnection, resReturn, `orders JOIN customers ON orders.customer_id = customers.id`, `approved = 1 AND packageStatus = 0 ORDER BY orders.createdDate DESC`, `orders.*, customers.email`);
        else if (dataType === "get_unapproved_orders")
          await getFromDb(dbConnection, resReturn, `orders JOIN customers ON orders.customer_id = customers.id`, `approved = 0 ORDER BY orders.createdDate DESC`, `orders.*, customers.email`);
     
        else if (dataType === "get_ordered_orders")
          await getFromDb(dbConnection, resReturn, `orders JOIN customers ON orders.customer_id = customers.id`, `packageStatus = 1 ORDER BY orders.createdDate DESC`, `orders.*, customers.email`);


        else if (dataType === "get_completed_orders")
          await getFromDb(dbConnection, resReturn, `orders JOIN customers ON orders.customer_id = customers.id`, `packageStatus = 2 ORDER BY orders.createdDate DESC`, `orders.*, customers.email`);

        else if (dataType === "get_canceled_orders")
          await getFromDb(dbConnection, resReturn, `orders JOIN customers ON orders.customer_id = customers.id`, `packageStatus = 3 ORDER BY orders.createdDate DESC`, `orders.*, customers.email`);

 
        else if (dataType === "get_returned_orders")
          await getFromDb(dbConnection, resReturn, `orders JOIN customers ON orders.customer_id = customers.id`, `packageStatus = 4 ORDER BY orders.createdDate DESC`, `orders.*, customers.email`);
        

        else if(dataType === "get_orders_by_email")
          await getFromDb(dbConnection, resReturn, `orders JOIN customers ON orders.customer_id = customers.id`, `email = '${data.email}'`, `orders.*, customers.email`);
        
        
        else if(dataType ==="get_order_by_orderId")
        await getFromDb(dbConnection, resReturn, `orders JOIN customers ON orders.customer_id = customers.id`, `orders.id = '${data.orderId}'`, `orders.*, customers.email`);
        else if (dataType === "get_unanswered_messages")
          await getFromDb(dbConnection, resReturn, "messages JOIN customers ON messages.customer_id = customers.id", `msgStatus = 0`, `messages.*, customers.email, customers.totalOrderCount`);
        else if (dataType === "get_answered_messages")
          await getFromDb(dbConnection, resReturn, "messages JOIN customers ON messages.customer_id = customers.id", `msgStatus != 0`, `messages.*, customers.email, customers.totalOrderCount`);
        else if (dataType === "get_reviews")
          await getFromDb(dbConnection, resReturn, 
            "reviews",
            `product_id = ${data.product_id}`,
          ); 
       
        else if (dataType === "get_customers")
          await getFromDb(dbConnection, resReturn, "customers", 'subscribed = 1');
        else if(dataType === "get_customers_bh")
        await getFromDb(dbConnection, resReturn, "customers", 'subscribed = 0');
        else if(dataType === "get_email_templates"){
          await getFromDb(dbConnection, resReturn, "email_templates")
        }
          else if (dataType === "get_emails")
          {await getFromDb(dbConnection, resReturn, "emails");}
          else if (dataType === "get_email_sequences")
            await getFromDb(dbConnection, resReturn, "email_sequences");
          else if (dataType === "get_email_campaigns")
          await getFromDb(dbConnection, resReturn, "email_campaigns");

          else if(dataType === "get_product_description")
            await getFromDb(dbConnection, resReturn, "products", `productId = ${data.productId}`)
        else if(dataType === "get_product_returns")
        await getFromDb(dbConnection, resReturn, "product_returns");


        else if (dataType === "send_unfulfilled_orders") {

         

          await updateDb(dbConnection, resReturn, "orders", data, `SET packageStatus = ? WHERE id = ?`);
        } else if (dataType === "send_unanswered_messages") {
        


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
      
        else if (dataType === "send_email_data") {
          console.log('started email send');
     

           
          await updateDb(dbConnection,  resReturn,
            "emails",
            data,
          );

        }

        else if(dataType=== "send_new_email_template"){

          await updateDb(dbConnection,  resReturn,
            "email_templates",
            data
          );

        }

    
        
        else if (dataType === "send_new_email") {
          console.log('started email send');
      
          

          await updateDb(dbConnection,  resReturn,
            "emails",
            data,
            'newEmail'
          );
        }
        
        else if(dataType==='send_new_sequence'){

     

          await updateDb(dbConnection,  resReturn,
            "email_sequences",
            data,
            
            'updateEmails'
          );

        }
        
        
        else if(dataType === 'send_new_capaign'){
         
          

          await updateDb(dbConnection,  resReturn,
            "email_campaigns",
            data,
            
            'updateEmails'
          );
        }
        else if(dataType === 'send_new_product_description'){

          
          console.log('send_new_product_description executed.');

    

          const newDescriptionIntegrated = await makeNewDescription(data.text , data.productId, dbConnection);

          if(newDescriptionIntegrated){
 
            
            
             
           return await resReturn(200, { descriptionUpdated: true })
         
             
            
          
        }

        else{

          return await resReturn(500, { descriptionUpdated: false })

       
        }

          //return true u res ako je uspesno revritowan fajl.
         
        }

        else if (dataType === 'send_new_return'){

          
        await updateDb(dbConnection,  resReturn,
          "product_returns",
          data
        );
        }

        else if(dataType ==="delete_email_sequence")
          {
           deleteRow(dbConnection, resReturn, 'email_sequences', data.deleteId)
        
          
          }

          else if(dataType === "delete_email"){
            deleteRow(dbConnection, resReturn, 'emails', data.deleteId)
          }

          else if(dataType==="delete_product_return"){
            deleteRow(dbConnection, resReturn, 'product_returns', data.deleteId)
          }
        
        else if(dataType === `wipe_orders`){
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
     
        
        else {
          console.error("Wrong data type");


          return await resReturn(500, { successfulLogin: false, error: "Wrong data type" })


          
        }
      
   
      

        



  }
  
  
   catch (error) {
    console.error(error);

    return await resReturn(500, { successfulLogin: false, error: "Internal Server Error" })


 
    
  }

  finally{

    if(dbConnection) await dbConnection.release();
  }
} //
