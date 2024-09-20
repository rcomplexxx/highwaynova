
import fs from 'fs'

const path = require('path');

import emailSendJob from '@/utils/utils-server/sendEmailJob.jsx';
import getTargets from '@/utils/utils-server/getTargets';





const   moveImagesToDeletedImagesFolder = (reviewProductImages, productId, shouldRecover)=>{
  if(reviewProductImages){
   
    const basePath = path.join(
        process.cwd(),
        'public',
        'images',
        'review_images',
        `productId_${productId}`
      );
    const deletedImagesPath = path.join(basePath,`deleted_images`);

    const moveFrom = shouldRecover?deletedImagesPath:basePath;
    const moveTo = shouldRecover?basePath:deletedImagesPath;
  
  
    if (!fs.existsSync(deletedImagesPath))fs.mkdirSync(deletedImagesPath, { recursive: true });

    
  
    reviewProductImages?.forEach((imageName)=>{
      
      fs.rename(path.join(moveFrom,imageName), path.join(moveTo,imageName),function (err) {
        if (err) throw err
        console.log('Successfully renamed - AKA moved!')
      });
      
    
    });
  
  }
}



async function updateDb (dbConnection, resReturn, table, data, queryCondition) {


   



    
        
          
          console.log('proso up db', 'should be created')
    
          if(table==='orders'){
            
    
            
    
            for(const changedOrder of data){
    
              
              
               if(changedOrder.supplierCost!==undefined) 
                await dbConnection.query(`UPDATE orders SET packageStatus = ?, supplyCost = ? WHERE id = ?`, [changedOrder.packageStatus, changedOrder.supplierCost, changedOrder.id]);
               else await dbConnection.query(`UPDATE orders SET packageStatus = ? WHERE id = ?`, [changedOrder.packageStatus, changedOrder.id]);
    
            }
    
          }
         
    
    
          if(table==='product_returns'){
    
          
           
            
            const orderData = (await dbConnection.query(`
              SELECT customer_id, packageStatus
              FROM orders
              WHERE id = ?
          LIMIT 1`,[data.orderId]))[0];
    
          console.log('order data', orderData)


                //Ako packageStatus vec postoji, koristiti taj. Ako ne, neki drugi
                const packageStatus = ((await dbConnection.query(`SELECT prevPackageStatus FROM product_returns WHERE orderId = ? LIMIT 1`, [data.orderId]))[0]?.prevPackageStatus ?? orderData.packageStatus);


    
            await dbConnection.query(`INSERT INTO product_returns (orderId, items,couponCode, tip, returnCost, createdDate, prevPackageStatus) VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [data.orderId,
              data.products,
              data.couponCode,
              data.tip,
              data.returnCost,
              Date.now(),
              packageStatus
    
              ]
            );
    
            await dbConnection.query(`UPDATE orders SET packageStatus = 4 WHERE id = ?`, [data.orderId]);
    
            await dbConnection.query(`UPDATE customers SET money_spent = ROUND(money_spent - ?, 2) WHERE id = ?`,[data.returnCost, orderData.customer_id])
    
    
    
    
            
    
    
            await dbConnection.query(`UPDATE email_campaigns SET emailSentCounter = (
              SELECT JSON_LENGTH(emails) 
          FROM email_sequences 
          WHERE id = email_campaigns.sequenceId
          ) WHERE extraData IS NOT NULL AND extraData = ?`, [JSON.stringify({orderId: data.orderId})])
    
    
    
    
    
    
          }
    
    
          else if(table==='messages'){
    
           console.log('message detected', data)
            
    
            for(const changedMessage of data){
    
              
              
             await dbConnection.query(`UPDATE messages SET msgStatus = ? WHERE id = ?`,
              [changedMessage.msgStatus,
                changedMessage.id]
            );
    
          }
          }
    
    
          else if(table === "email_templates"){
    
            
    
            //delete template with id = 1 here
    
    
         
    
    
          const template_id = data.templateType==="main"?1:2;
    
          await dbConnection.query(`
            REPLACE INTO email_templates (id, designJson, emailFontValue, emailFontSize, emailWidthModeValue, mainBackgroundColor, templateType)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            template_id,
            data.designJson,
            data.emailFontValue,
            data.emailFontSize,
            data.emailWidthModeValue,
            data.mainBackgroundColor,
            data.templateType
          ]);
    
    
          }
    
         
    
    
    
    
          else if(table==='emails'){
    
            if(queryCondition=== 'newEmail'){
    
            console.log('in table emails');
           
    
            
    
            const insert_id = (await dbConnection.query(`
              SELECT COALESCE(
                (SELECT MIN(id + 1) 
                 FROM emails 
                 WHERE id + 1 NOT IN (SELECT id FROM emails)
                 AND EXISTS (SELECT 1 FROM emails WHERE id = 1)),
                1
              ) AS insert_id
            `))[0].insert_id;
           
            
    
     
    
            await dbConnection.query(`INSERT INTO emails (id, title, text) VALUES (?, ?, ?)`, [
              insert_id,
              data.title,
              data.text
            ]
            );
    
            
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
          
    
    
            const sequenceId = (await dbConnection.query(`
              SELECT COALESCE(
                (SELECT MIN(id + 1) 
                 FROM email_sequences 
                 WHERE id + 1 NOT IN (SELECT id FROM email_sequences)
                 AND EXISTS (SELECT 1 FROM email_sequences WHERE id = 1)),
                1
              ) AS insert_id
            `))[0].insert_id;
    
    
    
    
    
    
            await dbConnection.query(`INSERT INTO email_sequences (id, title, emails) VALUES (?, ?, ?)`,[
              sequenceId,
              data.title,
              data.emails]
            );
    
    
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
    
            //RUN JOB HERE.//
    
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
    
                
                  //imageNames
              moveImagesToDeletedImagesFolder(reviewProductImages, productId, true)
    
               
    
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
    
    
                console.log('checking data of i imagenames', data[i].imageNames)
                  //nije imageNames
                  let reviewImages= JSON.parse(data[i].imageNames) || [];
    
                  
                console.log(reviewImages, 'and', );
               
                
                
                const deletedImages= reviewProductImages?.filter((img)=>!reviewImages.find(rImg => rImg===img));
    
                
                moveImagesToDeletedImagesFolder(deletedImages, productId, false);
                
    
          const recycledReviewImages= reviewImages?.filter((img)=>{
         
            return img.includes('deleted_images/');
          });
    
          
          data.imageNames= data.imageNames?.map(img=>{
            if(recycledReviewImages.find(addedImg => {return addedImg == img})){
              return img.split('deleted_images/')[1]
            }
            return img;
    
    
          })
    
          console.log('recycled images', recycledReviewImages)
    
          if(recycledReviewImages.length>0){
    
            const basePath = `${process.cwd()}/public/images/review_images/productId_${productId}/`;
            const deletedImagesPath = `${basePath}/deleted_images/`;
    
    
         
      
            recycledReviewImages?.forEach((image)=>{
           
              
    
    
             
              fs.rename(`${deletedImagesPath}${image.split('deleted_images/')[1]}`, `${basePath}${image.split('deleted_images/')[1]}`,function (err) {
                if (err) throw err
                console.log('Successfully renamed - AKA moved!')
              });
              
            
            });
    
           
    
        }
      
    
    
    
    
            
    
                await dbConnection.query(`UPDATE reviews SET name = ?, text = ?, imageNames = ?, stars = ? WHERE id = ?`, [
                  data[i].name,
                  data[i].text,
                  data[i].imageNames === "null" ? null : data[i].imageNames,
                  data[i].stars,
                  data[i].id
                ]
                );
    
    
    
    
    
    
                if (data[i].swapId) {
    
    
    
    
                  const swappingTargetRow = (await dbConnection.query(`SELECT * FROM reviews WHERE id = ?`, [data[i].id]))[0];
              
                  const swapRow = (await dbConnection.query(`SELECT * FROM reviews WHERE id = ?`,[data[i].swapId]))[0];
    
                  if (swapRow) {
                    await dbConnection.query(
                      `UPDATE reviews SET name = ?, text = ?, stars = ?, imageNames = ? WHERE id = ?`,
                    [
                      swapRow.name,
                      swapRow.text,
                      swapRow.stars,
                      swapRow.imageNames,
                      data[i].id]
                    );
    
                    await dbConnection.query(
                      `UPDATE reviews SET name = ?, text = ?, stars = ?, imageNames = ? WHERE id = ?`,
                   [
                      swappingTargetRow.name,
                      swappingTargetRow.text,
                      swappingTargetRow.stars,
                      swappingTargetRow.imageNames,
                      data[i].swapId
                   ]
                    );
                  } 
                  
                  else {
    
         
                    return await resReturn(500, { successfulLogin: false, error: "Swap id doesn't exist." })
                  }
    
    
    
    
    
                }
    
    
                
              }
              console.log('proso delete stat')
    
            }
    
    
    
    
           
            } 
           
            
           
          
    
        
    
            return await resReturn(200, { data_saved: true })
       
    
        
            
    
         
     
            
    
    
      
    

    

}

module.exports = updateDb;