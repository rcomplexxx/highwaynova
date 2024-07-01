import fs from 'fs'
import { verifyToken } from "../../utils/auth.js"; // Adjust the path based on your project structure
import RateLimiter from "@/utils/rateLimiter.js";
import betterSqlite3 from "better-sqlite3";
import emailSendJob from '@/utils/sendEmailJob.jsx';
import makeNewDescription from "../../utils/makeNewDescription.js"
import reorderReviewsByRatingAndImages from '@/utils/reorderReviews.jsx';
import createSqliteTables from '@/utils/createSqliteTables.js';
import getTargets from '@/utils/getTargets.js';



const limiterPerTwoMins = new RateLimiter({
  apiNumberArg: 5,
  tokenNumberArg: 20,
  expireDurationArg: 120, //secs
});

export default async function adminCheckHandler(req, res) {
  const { token } = req.cookies;


  const resReturn = (statusNumber, jsonObject, db)=>{

    console.log('returning res', statusNumber, jsonObject);

     
    res.status(statusNumber).json(jsonObject)
    if(db)db.close();
 }

  const db = betterSqlite3(process.env.DB_PATH);

  const getFromDb = (table, queryCondition=true, selectVariables='*') => {
    try {
     
      let rows;

      if(table==="emails"){
        
       let queryString = `SELECT * FROM emails`;
       const rows1 = db.prepare(queryString).all();


       let rows2=[];
      //  let row2_5={};
       try{
        queryString = `SELECT * FROM email_sequences`;
        rows2 = db.prepare(queryString).all();

        // queryString = `SELECT * FROM key_email_sequences WHERE id = 1`;
        // row2_5 = db.prepare(queryString).get();

       }catch{}

       
       let rows3=[];
       try{
        queryString = `SELECT * FROM email_campaigns`;
        rows3 = db.prepare(queryString).all();
       }catch{}

      //  keySequences: row2_5,
       rows= {emails: rows1, sequences: rows2,  campaigns: rows3};

      }

     

else{


      let queryString;

      if(table==="reviews"){
        queryString = `SELECT id, name, text, stars, imageNames, product_id FROM reviews WHERE ${queryCondition}`;

      }

     else{
       queryString = `SELECT ${selectVariables} FROM ${table} WHERE ${queryCondition}`;

      
      } 

      console.log('my query selector is', queryString)

    
 

      // Fetching data from the specified table with the given query condition
     rows = db.prepare(queryString).all();

    }

      // Closing the database connection

      return resReturn(200, { data: rows }, db)
   
      
    } catch (error) {
      console.error("Error fetching data from database:", error);

      return resReturn(500, { successfulLogin: false, error: "No data to send" }, db)
      
      
    }
  };


//   function deleteImage(product_id, imageName) {
//     const fs = require('fs');

//     // Construct the file path
//     const filePath = `${process.cwd()}/public/images/review_images/productId_${product_id}/${imageName}`;
  

//     try {
//         // Check if the file exists
//         if (fs.existsSync(filePath)) {
//             // Delete the file
//             fs.unlinkSync(filePath);
//             console.log(`File '${imageName}' deleted successfully.`);
//         } else {
//             console.log(`File '${imageName}' not found.`);
//         }
//     } catch (error) {
//         console.error(`Error deleting file '${imageName}':`, error);
//     }
// }



  function  wipeReviewImageDirectory(product_id) {

    console.log('wipe dir entered, ', product_id)

    const path = require('path');

    const directoryPath = `${process.cwd()}/public/images/review_images/productId_${product_id}/`
    // Get a list of all files and directories in the specified directory
    const files = fs.readdirSync(directoryPath);

    // Iterate over each file/directory
    files.forEach(file => {
        const filePath = path.join(directoryPath, file);

        // Delete the file or directory
        fs.rmSync(filePath, { recursive: true, force: true });
    });

    // Remove the directory itself
    fs.rmdirSync(directoryPath);
}


  const deleteRow= (tableName, deleteId)=>{


    try {

    console.log('deleting data row from', tableName, deleteId)
  
    

    if(tableName==='email_sequences')
    db.prepare(`DELETE FROM email_campaigns WHERE sequenceId = ?`).run(deleteId);


   db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(deleteId);

   return resReturn(200, { row_deleted: true }, db)
  

   
  } catch (error) {
    console.error(error);

    return resReturn(500, { successfulLogin: false, error: "Database update error" }, db)
   
    

    
  }
    
  }



  const wipeData =(tableName, product_id)=>{



    try {

      console.log('reviews wipiong', tableName, product_id)
  
      

      if(tableName==='reviews'){

        
      if (product_id == 'all'){


        const query = db.prepare('SELECT DISTINCT product_id FROM reviews');
        const product_ids = query.all();
        console.log('productids', product_ids)
        product_ids.forEach(product_id =>{
          wipeReviewImageDirectory(product_id.product_id)
        })

        db.prepare(`DELETE FROM reviews`).run();
        db.prepare(`DROP TABLE IF EXISTS reviews`).run()
          }
          else{
            const deletedItemsNumber=  db.prepare(`SELECT COUNT(id) as count FROM reviews WHERE product_id = ?`).get(product_id).count;
            db.prepare(`DELETE FROM reviews WHERE product_id = ?`).run(product_id);
            wipeReviewImageDirectory(product_id);
            db.prepare(`UPDATE reviews SET id = id - ? WHERE product_id > ?`).run(
              deletedItemsNumber, product_id
            );
            

          }
        }


        else{

          if(tableName==='customers'){

            try{
              db.prepare(`DELETE FROM product_returns`).run();
              db.prepare(`DROP TABLE IF EXISTS product_returns`).run();
              }
              catch(error){}

            try{
              
            db.prepare(`DELETE FROM orders`).run();
            db.prepare(`DROP TABLE IF EXISTS orders`).run();

            }
            catch(error){}

            try{
              
              db.prepare(`DELETE FROM messages`).run();
              db.prepare(`DROP TABLE IF EXISTS messages`).run();

              db.prepare(`DELETE FROM email_campaigns`).run();
              db.prepare(`DROP TABLE IF EXISTS email_campaigns`).run();
  
              }
              catch(error){}

          
          }

          else if(tableName==='orders'){

            try{
              db.prepare(`DELETE FROM product_returns`).run();
              db.prepare(`DROP TABLE IF EXISTS product_returns`).run();
              }
              catch(error){}

          }
        

          db.prepare(`DELETE FROM ${tableName}`).run();
          db.prepare(`DROP TABLE IF EXISTS ${tableName}`).run();


          createSqliteTables();

        }
       


        createSqliteTables();

        return resReturn(200, { data_wiped: true }, db)
   

     
      } catch (error) {
      
        
        return resReturn(500, {successfulLogin: false, error: "Database update error" }, db)
   
 
        
      }
  }

  const updateDb = async (table, data, queryCondition) => {
    try {
    
      

     


      if(table==='product_returns'){

      
       
        console.log('proso up db', 'should be created')
        
        const orderData = db.prepare(`
          SELECT o.customer_id, o.packageStatus, c.id AS customer_id
          FROM orders o
          JOIN customers c ON o.customer_id = c.id
          WHERE o.id = ?
      `).get(data.orderId);

        if(orderData.packageStatus ==="4")return;

        db.prepare(`INSERT INTO 'product_returns' (orderId, items,couponCode, tip, cashReturned, createdDate) VALUES (?, ?, ?, ?, ?, ?)`).run(
          data.orderId,
          data.products,
          data.couponCode,
          data.tip,
          data.cashReturned,
          Math.floor(Date.now() / 86400000)
        );

        db.prepare(`UPDATE orders SET packageStatus = 3 WHERE id = ?`).run(data.orderId);

        db.prepare(`UPDATE customers SET totalOrderCount = totalOrderCount - 1, money_spent = ROUND(money_spent - ?, 2) WHERE id = ?`).run(data.cashReturned, orderData.customer_id)


        db.prepare(`UPDATE email_campaigns SET emailSentCounter = (
          SELECT json_array_length(email_sequences.emails) 
          FROM email_sequences 
          WHERE email_campaigns.sequenceId = email_sequences.id
      ) WHERE extraData IS NOT NULL AND extraData = ?`).run(JSON.stringify({orderId: data.orderId}))

      console.log('campaign should be killed now using email_seuqnces', db.prepare(`SELECT * FROM email_campaigns WHERE extraData IS NOT NULL AND extraData = ?`).get(JSON.stringify({orderId: data.orderId})));
          //killCampaign here
      }


      else if(table === "email_template"){


        //delete template with id = 1 here


        db.prepare(`DELETE FROM email_template WHERE id = 1`).run();

     

        db.prepare(`INSERT INTO email_template (id, designJson) VALUES (?, ?)`).run(
          1,
          data.designJson
        );

      }





      else if(table==='emails'){

        if(queryCondition=== 'newEmail'){

        console.log('in table emails');
       

        console.log('should be created');

        db.prepare(`INSERT INTO emails (title, text) VALUES (?, ?)`).run(
          data.title,
          data.text,
        );

        console.log('should be inserted?');
        }



        else{
          data.forEach(emailData=>{
            db.prepare(`UPDATE emails SET title = ?, text = ? WHERE id = ?`).run(
              emailData.title,
              emailData.text,
              emailData.id
              );
          })
        
        }
      }





      else if(table==='email_sequences'){


        console.log('in table email_sequences');
      

        console.log('should be created');

        let insertId = db.prepare(`SELECT id FROM email_sequences WHERE id = 1`).get()?.id;

        if(insertId)
        insertId = db.prepare(`SELECT id FROM email_sequences WHERE id + 1 NOT IN (SELECT id FROM email_sequences)`).get().id + 1;
        else insertId=1

       const sequenceId = db.prepare(`INSERT INTO email_sequences (id, title, emails) VALUES (?, ?, ?)`).run(
        insertId,
          data.title,
          data.emails,
        ).lastInsertRowid;

        console.log('should be created3', data.key_sequence_type);

        if(data.key_sequence_type){

          console.log('should be created');

          db.prepare(`UPDATE key_email_sequences SET ${data.key_sequence_type} = ? WHERE id = 1`).run(sequenceId)

        }
        
      }












      else if(table==='email_campaigns'){

        console.log('in table email_campaigns');

        if(data.sequenceId.toString()=== process.env.WELCOME_SEQUENCE_ID || data.sequenceId.toString()=== process.env.THANK_YOU_SEQUENCE_ID
      || data.sequenceId.toString()=== process.env.THANK_YOU_SEQUENCE_FIRST_ORDER_ID)
      return resReturn(500, { success: false }, db)
 
      

        const targets = JSON.stringify(getTargets(data.targetCustomers, false, db))
      
        console.log('targets for campaign are ', targets)

        const result = db.prepare(`INSERT INTO email_campaigns (title, sequenceId, sendingDateInUnix, emailSentCounter,  retryCounter, targetCustomers, reserveTargetedCustomers) VALUES (?, ?, ?, ?, ?, ?, ?)`)
        .run(
          data.title,
          data.sequenceId,
          data.sendingDateInUnix,
          0,
          0,
          targets,
          data.markTraffic==="mark_with_current_campaign"?1:0
          
          
        );

        //RUN JOB HERE.

        //sendDelayAfterPrevious

        console.log('sending date in unix!!', data.sendingDateInUnix)

        const campaignId = result.lastInsertRowid;


     
        


        await emailSendJob(data.sendingDateInUnix,campaignId);

      }








      else if(table==='messages'){
        

        for (let i = 0; i < data.length; i++) {
        db.prepare(`UPDATE messages ${queryCondition}`).run(
          data[i].status,
          data[i].id,
        );

      }
      }











     
        if (table === "reviews" ) {





          //factor which determains for how much ids moves.

          const productId = db.prepare(`SELECT product_id FROM reviews WHERE id = ${data[0].id}`).all()[0].product_id;




        

          for (let i = 0; i < data.length; i++) {

      



            
            console.log('upao u save db', data, productId)


          const reviewProductImages =  JSON.parse(db.prepare(`SELECT imageNames FROM reviews WHERE id = ${data[i].id}`).all()[0].imageNames);
       
          




          if (data[i].deleted) {




            let reviewImages= JSON.parse(data[i].imageNames);
            if(!reviewImages)reviewImages=[];
         
            
         
            if(reviewProductImages){
             
                const basePath = `${process.cwd()}/public/images/review_images/productId_${productId}/`;
                const deletedImagesPath = `${basePath}/deleted_images/`;


                if (!fs.existsSync(deletedImagesPath)) {
                  fs.mkdirSync(deletedImagesPath, { recursive: true });

                reviewProductImages?.forEach((image)=>{
                  console.log('path', image);
                  fs.rename(`${basePath}/${image}`, `${basePath}/deleted_images/${image}`,function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - AKA moved!')
                  });
                  
                
                });
            }
          }

           

           db.prepare(
              `DELETE FROM reviews WHERE id = ?`,
            ).run(data[i].id);
           
            
            db.prepare(`UPDATE reviews SET id = id - 1 WHERE id > ?`).run(
              data[i].id,
            );

            console.log('Deleted. Now minus')

            for(let j =i+1; j<data.length; j++){
              data[j].id = data[j].id -1;
            }


            console.log('deleted',data[i].deleted)


          } 
          
          
          
          
          else {


              let reviewImages= JSON.parse(data[i].imageNames);
            console.log(reviewImages, 'and', );
            if(!reviewImages)reviewImages=[];
            
            const deletedImages= reviewProductImages?.filter((img)=>{
              console.log('img name', img)
              return !reviewImages.includes(img)
            });

            
            if(deletedImages){
             
              const basePath = `${process.cwd()}/public/images/review_images/productId_${productId}/`;
              const deletedImagesPath = `${basePath}/deleted_images/`;


              if (!fs.existsSync(deletedImagesPath)) {
                fs.mkdirSync(deletedImagesPath, { recursive: true });
              }

                deletedImages.forEach((deletedImage)=>{
                  console.log('path', deletedImage);
                  fs.rename(`${basePath}/${deletedImage}`, `${deletedImagesPath}/${deletedImage}`,function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - AKA moved!')
                  });
          });
        
      }

      const addedImagesFromDel= reviewImages?.filter((img)=>{
     
        return img.includes('deleted_images/');
      });

      
      data.imageNames= data.imageNames?.map(img=>{
        if(addedImagesFromDel.find(addedImg => {return addedImg == img})){
          return img.split('deleted_images/')[1]
        }
        return img;


      })

      console.log('hello everyone!', addedImagesFromDel)

      if(addedImagesFromDel.length>0){

        const basePath = `${process.cwd()}/public/images/review_images/productId_${productId}/`;
        const deletedImagesPath = `${basePath}/deleted_images/`;


     
  
        addedImagesFromDel?.forEach((image)=>{
          console.log('path', image);


          if(image.includes('deleted_images/'))
          fs.rename(`${deletedImagesPath}${image.split('deleted_images/')[1]}`, `${basePath}${image.split('deleted_images/')[1]}`,function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
          });
          
        
        });

       

    }
  




        

            db.prepare(`UPDATE reviews ${queryCondition}`).run(
              data[i].name,
              data[i].text,
              data[i].imageNames === "null" ? null : data[i].imageNames,
              data[i].stars,
              data[i].id,
            );

            if (data[i].swapId) {
              const currentRowData = db
                .prepare(`SELECT * FROM reviews WHERE id = ?`)
                .get(data[i].id);
              const targetRowData = db
                .prepare(`SELECT * FROM reviews WHERE id = ?`)
                .get(data[i].swapId);

              if (targetRowData) {
                db.prepare(
                  `UPDATE reviews SET name = ?, text = ?, stars = ?, imageNames = ? WHERE id = ?`,
                ).run(
                  targetRowData.name,
                  targetRowData.text,
                  targetRowData.stars,
                  targetRowData.imageNames,
                  data[i].id,
                );

                db.prepare(
                  `UPDATE reviews SET name = ?, text = ?, stars = ?, imageNames = ? WHERE id = ?`,
                ).run(
                  currentRowData.name,
                  currentRowData.text,
                  currentRowData.stars,
                  currentRowData.imageNames,
                  data[i].swapId,
                );
              } else {
                db.prepare(`DELETE FROM reviews WHERE id = ?`).run(data[i].id);

                db.prepare(
                  `INSERT INTO reviews (id, name, text, stars, imageNames, product_id) VALUES (?, ?, ?, ?, ?, ?)`,
                ).run(
                  data[i].swapId,
                  currentRowData.name,
                  currentRowData.text,
                  currentRowData.stars,
                  currentRowData.imageNames,
                  currentRowData.product_id,
                );
              }
            }


            
          }
          console.log('proso delete stat')

        }




       
        } 
       
        
       
      

    

        return resReturn(200, { data_saved: true }, db)
   

    
        

     
    } catch (error) {
      console.error(error);

      return resReturn(500, { successfulLogin: false, error: "Database update error" }, db)
   
   
      
    }
  };


  

  try {
    // const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    // if (!(await limiterPerTwoMins.rateLimiterGate(clientIp, db))) return resReturn(429, { error: "Too many requests." }, db)
   

      

    

    // Verify the token
    const userIsAdmin = verifyToken(token);

    // You might want to check if the user with this ID has admin privileges in your database
    // For simplicity, let's assume userId 1 is the admin
    if (userIsAdmin) {
      const { dataType, data } = req.body;
      console.log('data', data);
     
      
      if (!dataType){

        return resReturn(200, { successfulLogin: true }, db)

        
      }

      else {

        

        if(dataType.startsWith("send_") && !data) return resReturn(500, { successfulLogin: false, error: "No data to send" }, db)
        
        




        if(dataType === "get_order_cash_info")  return getFromDb("orders", `approved = '1'`, "createdDate, items, tip, couponCode");
        //Ovde approved
        else if(dataType === "get_order_cash_info_only_fulfilled_orders") return getFromDb("orders", `packageStatus != '0'`, "createdDate, items, tip, couponCode");
        else if (dataType === "get_unfulfilled_orders")
          return getFromDb(`orders JOIN customers ON orders.customer_id = customers.id`, `approved = '1' AND packageStatus = '0'`, `orders.*, customers.email`);
        else if (dataType === "get_unapproved_orders")
          return getFromDb(`orders JOIN customers ON orders.customer_id = customers.id`, `approved = '0'`, `orders.*, customers.email`);
        else if (dataType === "get_fulfilled_orders")
          return getFromDb(`orders JOIN customers ON orders.customer_id = customers.id`, `packageStatus != '0' AND packageStatus != '3'`, `orders.*, customers.email`);

        
        else if(dataType === "get_orders_by_email")
        return getFromDb(`orders JOIN customers ON orders.customer_id = customers.id`, `email = '${data.email}'`, `orders.*, customers.email`);
      

       
        
        else if(dataType ==="get_order_by_orderId")
        return getFromDb(`orders JOIN customers ON orders.customer_id = customers.id`, `orders.id = '${data.orderId}'`, `orders.*, customers.email`);
        else if (dataType === "get_unanswered_messages")
          return getFromDb("messages JOIN customers ON messages.customer_id = customers.id", `msgStatus = '0'`, `messages.*, customers.email, customers.totalOrderCount`);
        else if (dataType === "get_answered_messages")
          return getFromDb("messages JOIN customers ON messages.customer_id = customers.id", `msgStatus != '0'`, `messages.*, customers.email, customers.totalOrderCount`);
        else if (dataType === "get_reviews")
          return getFromDb(
            "reviews",
            `product_id = ${data.product_id}`,
          ); 
       
        else if (dataType === "get_customers")
          return getFromDb("customers", 'subscribed = 1');
        else if(dataType === "get_customers_bh")
        return getFromDb("customers", 'subscribed = 0');
        else if(dataType === "get_main_email_template")
          return getFromDb("email_template", 'id = 1')
          else if (dataType === "get_emails")
          {return getFromDb("emails");}
          else if (dataType === "get_email_sequences")
            return getFromDb("email_sequences");
          else if (dataType === "get_email_campaigns")
          return getFromDb("email_campaigns");
        else if(dataType === "get_product_returns")
        return getFromDb("product_returns");


        else if (dataType === "send_unfulfilled_orders") {
         

          await updateDb("orders", data, `SET packageStatus = ? WHERE id = ?`);
        } else if (dataType === "send_unanswered_messages") {
        


          await updateDb("messages", data, `SET msgStatus = ? WHERE id = ?`);
        } else if (dataType === "send_reviews") {


       
          

          await updateDb(
            "reviews",
            data,
            "SET name = ?, text = ?, imageNames = ?, stars = ? WHERE id = ?",
          );
         
        } 
        else if (dataType === "send_reviews_reorder") {


      


              const successfulReorder= await reorderReviewsByRatingAndImages(data.product_id);


          
             
             if(successfulReorder) return resReturn(200, { success: true }, db)
              else  return resReturn(500, { success: false }, db)
         
              
         
        } 
      
        else if (dataType === "send_email_data") {
          console.log('started email send');
     

           
          await updateDb(
            "emails",
            data,
          );

        }

        else if(dataType=== "send_new_main_email_template"){

          await updateDb(
            "email_template",
            data
          );

        }
        
        else if (dataType === "send_new_email") {
          console.log('started email send');
      
          

          await updateDb(
            "emails",
            data,
            'newEmail'
          );
        }
        
        else if(dataType==='send_new_sequence'){

     

          await updateDb(
            "email_sequences",
            data,
            
            'updateEmails'
          );

        }
        
        
        else if(dataType === 'send_new_capaign'){
         
          

          await updateDb(
            "email_campaigns",
            data,
            
            'updateEmails'
          );
        }
        else if(dataType === 'send_new_product_description'){
          console.log('send_new_product_description executed.');

          if(data.productId==="") {
            return resReturn(500, { descriptionUpdated: false }, db)
         
         
            
          }

          const newDescriptionIntegrated = makeNewDescription(data.text , data.productId);

          if(newDescriptionIntegrated){
 
            
            
             
           return resReturn(200, { descriptionUpdated: true }, db)
         
             
            
          
        }

        else{

          return resReturn(500, { descriptionUpdated: false }, db)

       
        }

          //return true u res ako je uspesno revritowan fajl.
         
        }

        else if (dataType === 'send_new_return'){

          
        await updateDb(
          "product_returns",
          data
        );
        }

        else if(dataType ==="delete_email_sequence")
          {
           deleteRow('email_sequences', data.deleteId)
        
          
          }
        
        else if(dataType === `wipe_orders`){
          wipeData('orders')
        }
        else if(dataType === `wipe_messages`){
          wipeData('messages')
        }
        else if(dataType === `wipe_reviews`){
          console.log('reviews wipiong', data.product_id)
          wipeData('reviews', data.product_id)
        }
        else if(dataType ==="wipe_product_returns")
        wipeData('product_returns')

        else if(dataType ==="wipe_emails")
          {
          wipeData('emails')
          wipeData('email_sequences')
          wipeData('email_campaigns')
          }

        else if(dataType ==="wipe_email_sequences")
         {
          wipeData('email_campaigns')
          wipeData('email_sequences')
         
         }
        else if(dataType ==="wipe_email_campaigns")
          wipeData('email_campaigns')

        else if(dataType ==="wipe_customers")
          wipeData('customers')
     
        
        else {
          console.error("Wrong data type");


          return resReturn(500, { successfulLogin: false, error: "Wrong data type" }, db)


          
        }
      }
    } else {

      return resReturn(400, { successfulLogin: false,
        error: "You do not have access to this sector. Get lost noob.", }, db)


   
    }
  } catch (error) {
    console.error(error);

    return resReturn(500, { successfulLogin: false, error: "Internal Server Error" }, db)


 
    
  }
} //
