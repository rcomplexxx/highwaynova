import fs from 'fs'
import { verifyToken } from "../../utils/auth.js"; // Adjust the path based on your project structure
import RateLimiter from "@/utils/rateLimiter.js";
import betterSqlite3 from "better-sqlite3";
import emailSendJob from '@/utils/sendEmailJob.jsx';
import makeNewDescription from "../../utils/makeNewDescription.js"
import reorderReviewsByRatingAndImages from '@/utils/reorderReviews.jsx';

const limiterPerTwoMins = new RateLimiter({
  apiNumberArg: 5,
  tokenNumberArg: 20,
  expireDurationArg: 120, //secs
});

export default async function adminCheckHandler(req, res) {
  const { token } = req.cookies;

  const getFromDb = (table, queryCondition=true, selectVariables='*') => {
    try {
      const db = betterSqlite3(process.env.DB_PATH);
      let rows;

      if(table=="emails"){
        
       let queryString = `SELECT * FROM emails`;
       const rows1 = db.prepare(queryString).all();


       let rows2=[];
       try{
        queryString = `SELECT * FROM email_sequences`;
        rows2 = db.prepare(queryString).all();
       }catch{}

       
       let rows3=[];
       try{
        queryString = `SELECT * FROM email_campaigns`;
        rows3 = db.prepare(queryString).all();
       }catch{}

       rows= {emails: rows1, sequences: rows2, campaigns: rows3};

      }

else{


      let queryString;
      if (table === "orders" || table === "messages" || table==="subscribers" || table==='subscribersbh' || table==="product_returns") {
        queryString = `SELECT ${selectVariables} FROM ${table} WHERE ${queryCondition}`;
      } 
      
      else {
        queryString = `SELECT id, name, text, stars, imageNames, product_id FROM ${table} WHERE ${queryCondition}`;
      }

      // Fetching data from the specified table with the given query condition
     rows = db.prepare(queryString).all();

    }

      // Closing the database connection
      db.close();

      res.status(200).json({ data: rows });
    } catch (error) {
      console.error("Error fetching data from database:", error);
      return res
        .status(500)
        .json({ successfulLogin: false, error: "No data to send" });
    }
  };


  function deleteImage(product_id, imageName) {
    const fs = require('fs');

    // Construct the file path
    const filePath = `${process.cwd()}/public/images/review_images/productId_${product_id}/${imageName}`;
  

    try {
        // Check if the file exists
        if (fs.existsSync(filePath)) {
            // Delete the file
            fs.unlinkSync(filePath);
            console.log(`File '${imageName}' deleted successfully.`);
        } else {
            console.log(`File '${imageName}' not found.`);
        }
    } catch (error) {
        console.error(`Error deleting file '${imageName}':`, error);
    }
}



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



  const wipeData =(tableName, product_id)=>{



    try {

      console.log('reviews wipiong', tableName, product_id)
    const db = betterSqlite3(process.env.DB_PATH);

      if(tableName==='reviews'){
      if (product_id == 'all'){


        const query = db.prepare('SELECT DISTINCT product_id FROM reviews');
        const product_ids = query.all();
        console.log('productids', product_ids)
        product_ids.forEach(product_id =>{
          wipeReviewImageDirectory(product_id.product_id)
        })

        db.prepare(`DELETE FROM ${tableName}`).run();
        db.prepare(`DROP TABLE IF EXISTS ${tableName}`).run()
          }
          else{
            const deletedItemsNumber=  db.prepare(`SELECT COUNT(id) as count FROM ${tableName} WHERE product_id = ?`).get(product_id).count;
            db.prepare(`DELETE FROM ${tableName} WHERE product_id = ?`).run(product_id);
            wipeReviewImageDirectory(product_id);
            db.prepare(`UPDATE ${tableName} SET id = id - ? WHERE product_id > ?`).run(
              deletedItemsNumber, product_id
            );
            

          }
        }
        else{
          db.prepare(`DELETE FROM ${tableName}`).run();
          db.prepare(`DROP TABLE IF EXISTS ${tableName}`).run();
        }
        db.close();
        return res.status(200).json({ data_wiped: true });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ successfulLogin: false, error: "Database update error" });
      }
  }

  const updateDb = async (table, data, queryCondition) => {
    try {
      const db = betterSqlite3(process.env.DB_PATH);

     


      if(table=='product_returns'){

      
        db.prepare(
          `
          CREATE TABLE IF NOT EXISTS product_returns (
            id INTEGER PRIMARY KEY,
            orderId TEXT,
            items TEXT,
            couponCode TEXT,
            tip TEXT,
            cashReturned TEXT,
            createdDate DATE
          )
        `).run();
        console.log('proso up db')
        console.log('should be created');

        db.prepare(`INSERT INTO ${table} (orderId, items,couponCode, tip, cashReturned, createdDate) VALUES (?, ?, ?, ?, ?, ?)`).run(
          data.orderId,
          data.products,
          data.couponCode,
          data.tip,
          data.cashReturned,
          Math.floor(Date.now() / 86400000)
        );
        db.close();
        return res.status(200).json({ data_saved: true });
      }

      if(table!='emails' &&  table!='email_sequences' && table!='email_campaigns'){
      for (let i = 0; i < data.length; i++) {
        if (table === "reviews" ) {

          const productId = db.prepare(`SELECT product_id FROM reviews WHERE id = ${data[0].id}`).all()[0].product_id;
          console.log('upao u save db', data, productId)
       
         
          if (data[i].deleted) {



            let reviewImages= JSON.parse(data[i].imageNames);
            if(!reviewImages)reviewImages=[];
            const allReviewImages=  JSON.parse(db.prepare(`SELECT imageNames FROM reviews WHERE id = ${data[i].id}`).all()[0].imageNames);
            
         
            if(allReviewImages){
             
                const basePath = `${process.cwd()}/public/images/review_images/productId_${productId}/`;
                const deletedImagesPath = `${basePath}/deleted_images/`;


                if (!fs.existsSync(deletedImagesPath)) {
                  fs.mkdirSync(deletedImagesPath, { recursive: true });

                allReviewImages?.forEach((image)=>{
                  console.log('path', image);
                  fs.rename(`${basePath}/${image}`, `${basePath}/deleted_images/${image}`,function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - AKA moved!')
                  });
                  
                
                });
            }
          }

           






            const deleteStatement = db.prepare(
              `DELETE FROM ${table} WHERE id = ?`,
            );
            deleteStatement.run(data[i].id);
            db.prepare(`UPDATE ${table} SET id = id - 1 WHERE id > ?`).run(
              data[i].id,
            );


            console.log('deleted',data[i].deleted)


          } else {
              let reviewImages= JSON.parse(data[i].imageNames);
            console.log(reviewImages, 'and', );
            if(!reviewImages)reviewImages=[];
            const allReviewImages=  JSON.parse(db.prepare(`SELECT imageNames FROM reviews WHERE id = ${data[i].id}`).all()[0].imageNames);
            
            const deletedImages= allReviewImages?.filter((img)=>{
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
  

      


   

    





        

            db.prepare(`UPDATE ${table} ${queryCondition}`).run(
              data[i].name,
              data[i].text,
              data[i].imageNames === "null" ? null : data[i].imageNames,
              data[i].stars,
              data[i].id,
            );

            if (data[i].swapId) {
              const currentRowData = db
                .prepare(`SELECT * FROM ${table} WHERE id = ?`)
                .get(data[i].id);
              const targetRowData = db
                .prepare(`SELECT * FROM ${table} WHERE id = ?`)
                .get(data[i].swapId);

              if (targetRowData) {
                db.prepare(
                  `UPDATE ${table} SET name = ?, text = ?, stars = ?, imageNames = ? WHERE id = ?`,
                ).run(
                  targetRowData.name,
                  targetRowData.text,
                  targetRowData.stars,
                  targetRowData.imageNames,
                  data[i].id,
                );

                db.prepare(
                  `UPDATE ${table} SET name = ?, text = ?, stars = ?, imageNames = ? WHERE id = ?`,
                ).run(
                  currentRowData.name,
                  currentRowData.text,
                  currentRowData.stars,
                  currentRowData.imageNames,
                  data[i].swapId,
                );
              } else {
                db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(data[i].id);

                db.prepare(
                  `INSERT INTO ${table} (id, name, text, stars, imageNames, product_id) VALUES (?, ?, ?, ?, ?, ?)`,
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
       
        
        else {
          db.prepare(`UPDATE ${table} ${queryCondition}`).run(
            data[i].status,
            data[i].id,
          );
        }
      }
    }

      else if(table=='emails'){

        if(queryCondition=== 'newEmail'){

        console.log('in table emails');
        db.prepare(
          `
          CREATE TABLE IF NOT EXISTS emails (
            id INTEGER PRIMARY KEY,
            title TEXT,
            text TEXT 
          )
        `).run();

        console.log('should be created');

        db.prepare(`INSERT INTO ${table} (title, text) VALUES (?, ?)`).run(
          data.title,
          data.text,
        );

        console.log('should be inserted?');
        }



        else{
          data.forEach(emailData=>{
            db.prepare(`UPDATE ${table} SET title = ?, text = ? WHERE id = ?`).run(
              emailData.title,
              emailData.text,
              emailData.id
              );
          })
        
        }
      }

      else if(table=='email_sequences'){


        console.log('in table email_sequences');
        db.prepare(
          `
          CREATE TABLE IF NOT EXISTS email_sequences (
            id INTEGER PRIMARY KEY,
            title TEXT,
            emails TEXT
          )
        `).run();

        console.log('should be created');

       db.prepare(`INSERT INTO ${table} (title, emails) VALUES (?, ?)`).run(
          data.title,
          data.emails,
        );
        
      }

      else{

        console.log('in table email_campaigns');
        db.prepare(
          `
          CREATE TABLE IF NOT EXISTS email_campaigns (
            id INTEGER PRIMARY KEY,
            title TEXT,
            sequenceId INTEGER,
            sendingDateInUnix INTEGER,
            emailSentCounter INTEGER,
            retryCounter INTEGER,
            targetSubscribers TEXT
          )
        `).run();

        //Ovde pisati uslove za subscribere i traffic type kao sto je hot cold warm itd


        const result = db.prepare(`INSERT INTO ${table} (title, sequenceId, sendingDateInUnix, emailSentCounter, targetSubscribers) VALUES (?, ?, ?, ?, ?)`)
        .run(
          data.title,
          data.sequenceId,
          data.sendingDateInUnix,
          0,
          0,
          data.targetSubscribers
          
        );

        //RUN JOB HERE.

        //sendDelayAfterPrevious

        console.log('sending date in unix!!', data.sendingDateInUnix)

        const campaignId = result.lastInsertRowid;


        await emailSendJob(data.sendingDateInUnix,campaignId);

      }
      

    

    

        db.close();

       return res.status(200).json({ data_saved: true });

     
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ successfulLogin: false, error: "Database update error" });
    }
  };

  //   } catch (error) {
  //     console.error('Error handling GET request:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // }

  try {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (!(await limiterPerTwoMins.rateLimiterGate(clientIp)))
      return res.status(429).json({ error: "Too many requests." });

    // Verify the token
    const userIsAdmin = verifyToken(token);

    // You might want to check if the user with this ID has admin privileges in your database
    // For simplicity, let's assume userId 1 is the admin
    if (userIsAdmin) {
      const { dataType, data } = req.body;
      console.log('data', data);
      console.log(dataType);
      if (!dataType) return res.status(200).json({ successfulLogin: true });
      else {
        if(dataType === "get_order_cash_info")  return getFromDb("orders", `approved = '1'`, "createdDate, items, tip, couponCode");
        //Ovde approved
        else if(dataType === "get_order_cash_info_only_fulfilled_orders") return getFromDb("orders", `packageStatus != '0'`, "createdDate, items, tip, couponCode");
        else if (dataType === "get_unfulfilled_orders")
          return getFromDb("orders", `approved = '1' AND packageStatus = '0'`);
        else if (dataType === "get_unapproved_orders")
          return getFromDb("orders", `approved = '0'`);
        else if (dataType === "get_fulfilled_orders")
          return getFromDb("orders", `packageStatus != '0'`);
        else if(dataType === "get_orders_by_email")
        return getFromDb("orders", `email = '${data.email}'`);
        else if(dataType ==="get_order_by_orderId")
        return getFromDb("orders", `id = '${data.orderId}'`);
        else if (dataType === "get_unanswered_messages")
          return getFromDb("messages", `msgStatus = '0'`);
        else if (dataType === "get_answered_messages")
          return getFromDb("messages", `msgStatus != '0'`);
        else if (dataType === "get_reviews")
          return getFromDb(
            "reviews",
            `product_id = ${data.product_id}`,
          ); 
       
        else if (dataType === "get_subscribers")
          return getFromDb("subscribers");
        else if(dataType === "get_subscribers_bh")
        return getFromDb("subscribersbh");
          else if (dataType === "get_emails")
          {return getFromDb("emails");}
          else if (dataType === "get_email_sequences")
            return getFromDb("email_sequences");
          else if (dataType === "get_email_campaigns")
          return getFromDb("email_campaigns");
        else if(dataType === "get_product_returns")
        return getFromDb("product_returns");
        else if (dataType === "send_unfulfilled_orders") {
          if (!data)
            return res
              .status(500)
              .json({ successfulLogin: false, error: "No data to send" });

          await updateDb("orders", data, `SET packageStatus = ? WHERE id = ?`);
        } else if (dataType === "send_unanswered_messages") {
          if (!data)
            return res
              .status(500)
              .json({ successfulLogin: false, error: "No data to send" });

          await updateDb("messages", data, `SET msgStatus = ? WHERE id = ?`);
        } else if (dataType === "send_reviews") {


          if (!data)
            return res
              .status(500)
              .json({ successfulLogin: false, error: "No data to send" });

          await updateDb(
            "reviews",
            data,
            "SET name = ?, text = ?, imageNames = ?, stars = ? WHERE id = ?",
          );
         
        } 
        else if (dataType === "send_reviews_reorder") {


          if (!data)
            return res
              .status(500)
              .json({ successfulLogin: false, error: "No data to send" });


              const successfulReorder= await reorderReviewsByRatingAndImages(data.product_id);

             if(successfulReorder)return res.status(200).json({ success: true });
             else return res.status(500).json({ success: false });
              
         
        } 
      
        else if (dataType === "send_email_data") {
          console.log('started email send');
          if (!data)
            return res
              .status(500)
              .json({ successfulLogin: false, error: "No data to send" });

           
          await updateDb(
            "emails",
            data,
          );

        }
        
        else if (dataType === "send_new_email") {
          console.log('started email send');
          if (!data)
            return res
              .status(500)
              .json({ successfulLogin: false, error: "No data to send" });

              console.log('No data crossed', data);

          await updateDb(
            "emails",
            data,
            'newEmail'
          );
        }
        
        else if(dataType==='send_new_sequence'){

          if (!data)
            return res
              .status(500)
              .json({ successfulLogin: false, error: "No data to send" });

              console.log('No data crossed', data);

          await updateDb(
            "email_sequences",
            data,
            
            'updateEmails'
          );

        }
        
        
        else if(dataType === 'send_new_capaign'){
          console.log('started campaign send');
          if (!data)
            return res
              .status(500)
              .json({ successfulLogin: false, error: "No data to send" });

              console.log('No data crossed', data);

          await updateDb(
            "email_campaigns",
            data,
            
            'updateEmails'
          );
        }
        else if(dataType === 'send_new_product_description'){
          console.log('send_new_product_description executed.');
          const newDescriptionIntegrated = makeNewDescription(data.text , data.productId);

          if(newDescriptionIntegrated){

            res.status(200).json({ descriptionUpdated: true });
             
             
            
          
        }

        else{
          res
          .status(500)
          .json({ descriptionUpdated: false });
        }

          //return true u res ako je uspesno revritowan fajl.
         
        }

        else if (dataType == 'send_new_return'){
          if (!data)
          return res
            .status(500)
            .json({ successfulLogin: false, error: "No data to send" });

            console.log('No data crossed', data);

        await updateDb(
          "product_returns",
          data
        );
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
          wipeData('email_sequences')
          wipeData('email_campaigns')
         }
        else if(dataType ==="wipe_email_campaigns")
          wipeData('email_campaigns')
     
        
        else {
          console.error("Wrong data type");
          res
            .status(500)
            .json({ successfulLogin: false, error: "Wrong data type" });
        }
      }
    } else {
      res
        .status(400)
        .json({
          successfulLogin: false,
          error: "You do not have access to this sector. Get lost noob.",
        });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ successfulLogin: false, error: "Internal Server Error" });
  }
} //
