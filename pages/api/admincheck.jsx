import fs from 'fs'
import { verifyToken } from "../../utils/auth.js"; // Adjust the path based on your project structure
import RateLimiter from "@/utils/rateLimiter.js";
import emailSendJob from '@/utils/sendEmailJob.jsx';
import makeNewDescription from "../../utils/makeNewDescription.js"
import reorderReviewsByRatingAndImages from '@/utils/reorderReviews.jsx';
import createSqliteTables from '@/utils/createSqliteTables.js';
import getTargets from '@/utils/getTargets.js';

const getPool = require('../../utils/mariaDbPool');


const limiterPerTwoMins = new RateLimiter({
  apiNumberArg: 6,
  tokenNumberArg: 40,
  expireDurationArg: 120, //secs
});

export default async function adminCheckHandler(req, res) {
  const { token } = req.cookies;




  let dbConnection = await getPool().getConnection();


  const resReturn = async(statusNumber, jsonObject)=>{

    console.log('returning res', statusNumber, jsonObject);

    if(dbConnection) await dbConnection.release();

    res.status(statusNumber).json(jsonObject)

 }


  const getFromDb = async(table, queryCondition=true, selectVariables='*') => {
    try {
     
      let rows;

      if(table==="emails"){
        
       const rows1 = await dbConnection.query(`SELECT * FROM emails`);


       let rows2=[];
    
       
       try{
        
        rows2 = await dbConnection.query(`SELECT * FROM email_sequences`);

     
        

       }catch{}

       
       let rows3=[];
       try{
        
        rows3 = await dbConnection.query(`SELECT * FROM email_campaigns`);
       }catch{}

       
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
     rows = await dbConnection.query(queryString);

    }

      // Closing the database connection

      return await resReturn(200, { data: rows })
   
      
    } catch (error) {
      console.error("Error fetching data from database:", error);

      return await resReturn(500, { successfulLogin: false, error: "No data to send" })
      
      
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


  const deleteRow= async(tableName, deleteId)=>{


    try {

    console.log('deleting data row from', tableName, deleteId)
  
    

    if(tableName==='email_sequences')
    await dbConnection.query(`DELETE FROM email_campaigns WHERE sequenceId = ?`, [deleteId]);

    else if(tableName === 'emails'){

      const allSequences = await dbConnection.query(`SELECT id, emails FROM email_sequences`);


      const sequenceToDeleteIdArray = allSequences.filter((seq)=>{

        const seqEmails = JSON.parse(seq.emails);

        return seqEmails.find(seqEmail => seqEmail.id === deleteId)
      })


      for(const seq of sequenceToDeleteIdArray){
        await dbConnection.query(`DELETE FROM email_campaigns WHERE sequenceId = ?`, [seq.id]);
        await dbConnection.query(`DELETE FROM email_sequences WHERE id = ?`, [deleteId]);
      }

     

     

    }

    else if(tableName === "product_returns"){

      const prevPackageStatus = (await dbConnection.query(`SELECT prevPackageStatus FROM product_returns WHERE id = ?`,[deleteId]))[0].prevPackageStatus;
      const orderId = (await dbConnection.query(`SELECT orderId FROM product_returns WHERE id = ?`,[deleteId]))[0].orderId;

     

  

      const orderHasMultipleReturns = parseInt((await dbConnection.query(`
        SELECT COUNT(id) as count
        FROM product_returns
        WHERE orderId = ?
      `, [orderId]))[0].count);

      console.log('simple data', prevPackageStatus, orderId, orderHasMultipleReturns)
      
    
    
      const customerId = (await dbConnection.query(`SELECT customer_id FROM orders WHERE id = (SELECT orderId FROM product_returns WHERE id = ?)`,[deleteId]))[0].customer_id
      const cashReturned = Number((await dbConnection.query(`SELECT cashReturned FROM product_returns WHERE id = ?`, [deleteId]))[0].cashReturned);
     
      if(orderHasMultipleReturns===1){

        
      await dbConnection.query(`UPDATE orders SET packageStatus = ? WHERE id = ?`, [prevPackageStatus,orderId]);

      }


      await dbConnection.query(`UPDATE customers SET money_spent = ROUND(money_spent - ?, 2) WHERE id = ?`,[cashReturned, customerId])


    }


    await dbConnection.query(`DELETE FROM ${tableName} WHERE id = ?`,[deleteId]);

   return await resReturn(200, { row_deleted: true })
  

   
  } catch (error) {
    console.error(error);

    return await resReturn(500, { successfulLogin: false, error: "Database update error" })
   
    

    
  }
    
  }



  const wipeData = async(tableName, product_id)=>{



    try {

      console.log('reviews wipiong', tableName, product_id)
  
      

      if(tableName==='reviews'){

        
      if (product_id == 'all'){


        const product_ids = await dbConnection.query('SELECT DISTINCT product_id FROM reviews');
       
        console.log('productids', product_ids)
        product_ids.forEach(product_id =>{
          wipeReviewImageDirectory(product_id.product_id)
        })

        await dbConnection.query(`DELETE FROM reviews`);
        await dbConnection.query(`DROP TABLE IF EXISTS reviews`);
          }
          else{
            const deletedItemsNumber=  (await dbConnection.query(`SELECT COUNT(id) as count FROM reviews WHERE product_id = ?`, [product_id]))[0]?.count || 0;

           
             await dbConnection.query(`DELETE FROM reviews WHERE product_id = ?`, [product_id]);
            wipeReviewImageDirectory(product_id);
            await dbConnection.query(`UPDATE reviews SET id = id - ? WHERE product_id > ?`,[ deletedItemsNumber, product_id]);
            

          }
        }


        else{

          if(tableName==='customers'){

            try{
             await dbConnection.query(`DELETE FROM product_returns`);
             await dbConnection.query(`DROP TABLE IF EXISTS product_returns`);
              }
              catch(error){}

            try{
              
           await dbConnection.query(`DELETE FROM orders`);
           await dbConnection.query(`DROP TABLE IF EXISTS orders`);

            }
            catch(error){}

            try{
              
              await dbConnection.query(`DELETE FROM messages`);
              await dbConnection.query(`DROP TABLE IF EXISTS messages`);

              await dbConnection.query(`DELETE FROM email_campaigns`);
              await dbConnection.query(`DROP TABLE IF EXISTS email_campaigns`);
  
              }
              catch(error){}

          
          }

          else if(tableName==='orders'){

            try{
             await dbConnection.query(`DELETE FROM product_returns`);
             await dbConnection.query(`DROP TABLE IF EXISTS product_returns`);
              }
              catch(error){}

          }
        

          await dbConnection.query(`DELETE FROM ${tableName}`);
         await dbConnection.query(`DROP TABLE IF EXISTS ${tableName}`);



        }
       


        await createSqliteTables();//

        return await resReturn(200, { data_wiped: true })
   

     
      } catch (error) {
      
        
        return await resReturn(500, {successfulLogin: false, error: "Database update error" })
   
 
        
      }
  }

  const updateDb = async (table, data, queryCondition) => {
    try {
    
      

      if(table==='orders'){
        

        

        for(const changedOrder of data){

          await  console.log('pair', changedOrder)
          
        await dbConnection.query(`UPDATE orders SET packageStatus = ? WHERE id = ?`, [changedOrder.packageStatus, changedOrder.id]);

        }

      }
     


      if(table==='product_returns'){

      
       
        console.log('proso up db', 'should be created')
        
        const orderData = (await dbConnection.query(`
          SELECT customer_id, packageStatus
          FROM orders
          WHERE id = ?
      LIMIT 1`,[data.orderId]))[0];

      console.log('order data', orderData)

        // if(orderData[0]?.packageStatus ===3)return;
        //packageStatus 3 code je Returned

        await dbConnection.query(`INSERT INTO product_returns (orderId, items,couponCode, tip, cashReturned, createdDate, prevPackageStatus) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [data.orderId,
          data.products,
          data.couponCode,
          data.tip,
          data.cashReturned,
          Math.floor(Date.now() / 86400000),
          orderData.packageStatus

          ]
        );

        await dbConnection.query(`UPDATE orders SET packageStatus = 3 WHERE id = ?`, [data.orderId]);

        await dbConnection.query(`UPDATE customers SET money_spent = ROUND(money_spent - ?, 2) WHERE id = ?`,[data.cashReturned, orderData.customer_id])




        console.log('campaign should be killed now using email_seuqnces'
       
        
        
        );


        await dbConnection.query(`UPDATE email_campaigns SET emailSentCounter = (
          SELECT JSON_LENGTH(emails) 
      FROM email_sequences 
      WHERE id = email_campaigns.sequenceId
      ) WHERE extraData IS NOT NULL AND extraData = ?`, [JSON.stringify({orderId: data.orderId})])






      }


      else if(table==='messages'){

        await console.log('message detected', data)
        

        for(const changedMessage of data){

          await console.log('pair', changedMessage);
          
         await dbConnection.query(`UPDATE messages SET msgStatus = ? WHERE id = ?`,
          [changedMessage.msgStatus,
            changedMessage.id]
        );

      }
      }


      else if(table === "email_templates"){

        

        //delete template with id = 1 here


     


      const template_id = data.templateType==="main"?1:2;

await dbConnection.query(`DELETE FROM email_templates WHERE id = ?`, [template_id]);


       

       await dbConnection.query(`INSERT INTO email_templates (id, designJson, emailFontValue, emailFontSize, emailWidthModeValue, mainBackgroundColor, templateType) VALUES (?, ?, ?, ?, ?, ?, ?)`,
         [ template_id,
          data.designJson,
          data.emailFontValue,
          data.emailFontSize,
          data.emailWidthModeValue,
          data.mainBackgroundColor,
          data.templateType]
        );


      }

     




      else if(table==='emails'){

        if(queryCondition=== 'newEmail'){

        console.log('in table emails');
       

        console.log('should be created');

        const email_with_id_1_exists = (await dbConnection.query(`SELECT 1 FROM emails WHERE id = 1`))[0]?1:0;;

      

        const insert_id = !email_with_id_1_exists?1:(await dbConnection.query('SELECT MIN(id + 1) AS insert_id FROM emails WHERE id + 1 NOT IN (SELECT id FROM emails) LIMIT 1'))[0]?.insert_id;
          
 
       
        console.log('insert id is', insert_id)

 

        await dbConnection.query(`INSERT INTO emails (id, title, text) VALUES (?, ?, ?)`, [
          insert_id,
          data.title,
          data.text
        ]
        );

        console.log('should be inserted?');
        }



        else{

          for(const emailData of data){
           await dbConnection.query(`UPDATE emails SET title = ?, text = ? WHERE id = ?`,[
              emailData.title,
              emailData.text,
              emailData.id]
              );

          }
       
        
        }
      }





      else if(table==='email_sequences'){


        console.log('in table email_sequences');
      

        console.log('should be created');

        let  insertId =  (await dbConnection.query(`SELECT id FROM email_sequences WHERE id = 1`))[0]?.id;
     
        if(insertId){
           insertId = (await dbConnection.query(`SELECT id FROM email_sequences WHERE id + 1 NOT IN (SELECT id FROM email_sequences)`))[0]?.id + 1
       
        }
        else insertId=1

       const sequenceId = (await dbConnection.query(`INSERT INTO email_sequences (id, title, emails) VALUES (?, ?, ?)`,[
        insertId,
          data.title,
          data.emails]
        )).insertId;


        console.log('should be created3', data.key_sequence_type);

        if(data.key_sequence_type){

          console.log('should be created');

         await dbConnection.query(`UPDATE key_email_sequences SET ${data.key_sequence_type} = ? WHERE id = 1`,[sequenceId])

        }
        
      }












      else if(table==='email_campaigns'){

        console.log('in table email_campaigns');

        if(data.sequenceId.toString()=== process.env.WELCOME_SEQUENCE_ID || data.sequenceId.toString()=== process.env.THANK_YOU_SEQUENCE_ID
      || data.sequenceId.toString()=== process.env.THANK_YOU_SEQUENCE_FIRST_ORDER_ID)
      return await resReturn(500, { success: false })
 
      

        const targets = JSON.stringify(await getTargets(data.targetCustomers, false, dbConnection))
      
        console.log('targets for campaign are ', targets)

        const campaignId =   (await dbConnection.query(`INSERT INTO email_campaigns (title, sequenceId, sendingDateInUnix, emailSentCounter,  retryCounter, targetCustomers, reserveTargetedCustomers) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [ data.title,
          data.sequenceId,
          data.sendingDateInUnix,
          0,
          0,
          targets,
          data.markTraffic==="mark_with_current_campaign"?1:0
        ]
          
          
        )).insertId;

        //RUN JOB HERE.

        //sendDelayAfterPrevious

        console.log('sending date in unix!!', data.sendingDateInUnix)

     
        


        await emailSendJob(data.sendingDateInUnix,campaignId);

      }








   











     
        if (table === "reviews" ) {





          //factor which determains for how much ids moves.

          const productId =   (await dbConnection.query(`SELECT product_id FROM reviews WHERE id = ${data[0].id}`))[0].product_id;




        

          for (let i = 0; i < data.length; i++) {

      



            
            console.log('upao u save db', data, productId)


            const reviewProductImages = JSON.parse((await dbConnection.query(`SELECT imageNames FROM reviews WHERE id = ${data[i].id}`))[0].imageNames)
       
          




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

           

          await dbConnection.query(
              `DELETE FROM reviews WHERE id = ?`
            ,[data[i].id]);
           
            
            await dbConnection.query(`UPDATE reviews SET id = id - 1 WHERE id > ?`, [data[i].id] );

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

      console.log('images from del', addedImagesFromDel)

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
  




        

            await dbConnection.query(`UPDATE reviews ${queryCondition}`, [
              data[i].name,
              data[i].text,
              data[i].imageNames === "null" ? null : data[i].imageNames,
              data[i].stars,
              data[i].id
            ]
            );

            if (data[i].swapId) {
              const currentRowData = (await dbConnection.query(`SELECT * FROM reviews WHERE id = ?`, [data[i].id]))[0];
          
              const targetRowData = (await dbConnection.query(`SELECT * FROM reviews WHERE id = ?`,[data[i].swapId]))[0];

              if (targetRowData) {
                await dbConnection.query(
                  `UPDATE reviews SET name = ?, text = ?, stars = ?, imageNames = ? WHERE id = ?`,
                [
                  targetRowData.name,
                  targetRowData.text,
                  targetRowData.stars,
                  targetRowData.imageNames,
                  data[i].id]
                );

                await dbConnection.query(
                  `UPDATE reviews SET name = ?, text = ?, stars = ?, imageNames = ? WHERE id = ?`,
               [
                  currentRowData.name,
                  currentRowData.text,
                  currentRowData.stars,
                  currentRowData.imageNames,
                  data[i].swapId
               ]
                );
              } else {
              await dbConnection.query(`DELETE FROM reviews WHERE id = ?`,[data[i].id]);

              await dbConnection.query(
                  `INSERT INTO reviews (id, name, text, stars, imageNames, product_id) VALUES (?, ?, ?, ?, ?, ?)`,
               [
                  data[i].swapId,
                  currentRowData.name,
                  currentRowData.text,
                  currentRowData.stars,
                  currentRowData.imageNames,
                  currentRowData.product_id
               ]
                );
              }
            }


            
          }
          console.log('proso delete stat')

        }




       
        } 
       
        
       
      

    

        return await resReturn(200, { data_saved: true })
   

    
        

     
    } catch (error) {
      console.error(error);

      return await resReturn(500, { successfulLogin: false, error: "Database update error" })
   
   
      
    }
  };


  

  try {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (!(await limiterPerTwoMins.rateLimiterGate(clientIp, dbConnection))) return await resReturn(429, { error: "Too many requests." })
   

      

    

    // Verify the token
    const userIsAdmin = verifyToken(token);

    // You might want to check if the user with this ID has admin privileges in your database
    // For simplicity, let's assume userId 1 is the admin
    if (userIsAdmin) {
      const { dataType, data } = req.body;
      console.log('data', data);
     
      
      if (!dataType){

        return await resReturn(200, { successfulLogin: true })

        
      }

      else {

        

        if(dataType.startsWith("send_") && !data) return await resReturn(500, { successfulLogin: false, error: "No data to send" })
        
        




        if(dataType === "get_order_cash_info")  return getFromDb("orders", `approved = 1`, "createdDate, items, tip, couponCode");
        //Ovde approved
        else if(dataType === "get_order_cash_info_only_fulfilled_orders") return getFromDb("orders", `packageStatus != 0`, "createdDate, items, tip, couponCode");
        else if (dataType === "get_unfulfilled_orders")
          return getFromDb(`orders JOIN customers ON orders.customer_id = customers.id`, `approved = 1 AND packageStatus = 0 ORDER BY orders.id DESC`, `orders.*, customers.email`);
        else if (dataType === "get_unapproved_orders")
          return getFromDb(`orders JOIN customers ON orders.customer_id = customers.id`, `approved = 0 ORDER BY orders.id DESC`, `orders.*, customers.email`);
        else if (dataType === "get_fulfilled_orders")
          return getFromDb(`orders JOIN customers ON orders.customer_id = customers.id`, `packageStatus != 0 AND packageStatus != 3 ORDER BY orders.id DESC`, `orders.*, customers.email`);

        
        else if(dataType === "get_orders_by_email")
        return getFromDb(`orders JOIN customers ON orders.customer_id = customers.id`, `email = '${data.email}'`, `orders.*, customers.email`);
      

       
        
        else if(dataType ==="get_order_by_orderId")
        return getFromDb(`orders JOIN customers ON orders.customer_id = customers.id`, `orders.id = '${data.orderId}'`, `orders.*, customers.email`);
        else if (dataType === "get_unanswered_messages")
          return getFromDb("messages JOIN customers ON messages.customer_id = customers.id", `msgStatus = 0`, `messages.*, customers.email, customers.totalOrderCount`);
        else if (dataType === "get_answered_messages")
          return getFromDb("messages JOIN customers ON messages.customer_id = customers.id", `msgStatus != 0`, `messages.*, customers.email, customers.totalOrderCount`);
        else if (dataType === "get_reviews")
          return getFromDb(
            "reviews",
            `product_id = ${data.product_id}`,
          ); 
       
        else if (dataType === "get_customers")
          return getFromDb("customers", 'subscribed = 1');
        else if(dataType === "get_customers_bh")
        return getFromDb("customers", 'subscribed = 0');
        else if(dataType === "get_email_templates"){
          return getFromDb("email_templates")
        }
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
        


          await updateDb("messages", data);
        } else if (dataType === "send_reviews") {


       
          

          await updateDb(
            "reviews",
            data,
            "SET name = ?, text = ?, imageNames = ?, stars = ? WHERE id = ?",
          );
         
        } 
        else if (dataType === "send_reviews_reorder") {


      


              const successfulReorder= await reorderReviewsByRatingAndImages(data.product_id, dbConnection);


          
             
             if(successfulReorder) return await resReturn(200, { success: true })
              else  return await resReturn(500, { success: false })
         
              
         
        } 
      
        else if (dataType === "send_email_data") {
          console.log('started email send');
     

           
          await updateDb(
            "emails",
            data,
          );

        }

        else if(dataType=== "send_new_email_template"){

          await updateDb(
            "email_templates",
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
            return await resReturn(500, { descriptionUpdated: false })
         
         
            
          }

          const newDescriptionIntegrated = makeNewDescription(data.text , data.productId);

          if(newDescriptionIntegrated){
 
            
            
             
           return await resReturn(200, { descriptionUpdated: true })
         
             
            
          
        }

        else{

          return await resReturn(500, { descriptionUpdated: false })

       
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

          else if(dataType === "delete_email"){
            deleteRow('emails', data.deleteId)
          }

          else if(dataType==="delete_product_return"){
            deleteRow('product_returns', data.deleteId)
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


          return await resReturn(500, { successfulLogin: false, error: "Wrong data type" })


          
        }
      }
    } else {

      return await resReturn(400, { successfulLogin: false,
        error: "You do not have access to this sector. Get lost noob.", })


   
    }
  } catch (error) {
    console.error(error);

    return await resReturn(500, { successfulLogin: false, error: "Internal Server Error" })


 
    
  }
} //
