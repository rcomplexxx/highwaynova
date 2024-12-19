
import fs from 'fs'

const path = require('path');






const deleteOrRecoverImages = (reviewProductImages, productId, shouldRecover)=>{
  
  if (!reviewProductImages?.length) return;
   
  const basePath = path.join(process.cwd(), 'public', 'images', 'review_images', `productId_${productId}`);
    const deletedImagesPath = path.join(basePath,`deleted_images`);

    const [moveFrom, moveTo] = shouldRecover ? [deletedImagesPath, basePath] : [basePath, deletedImagesPath];
  
  
    if (!fs.existsSync(deletedImagesPath))fs.mkdirSync(deletedImagesPath, { recursive: true });

    
  
    reviewProductImages.forEach((imageName)=>{
      
      fs.rename(path.join(moveFrom,imageName), path.join(moveTo,imageName),function (err) {
        if (err) throw err
        console.log('Successfully renamed - AKA moved!', imageName)
      });
      
    
    });
  
  
}









async function updateDb (dbConnection, resReturn, table, data, revalidateReviews) {


   



  
        
          
          console.log('proso up db', 'should be created')
    
          if(table==='orders'){
            
    
            
    
            for(const changedOrder of data){
    
              
              
               if(changedOrder.supplierCost!==undefined) 
                await dbConnection.query(`UPDATE orders SET packageStatus = ?, supplyCost = ?, items = ? WHERE id = ?`, [changedOrder.packageStatus, changedOrder.supplierCost, changedOrder.items, changedOrder.id]);
               else await dbConnection.query(`UPDATE orders SET packageStatus = ?, items = ? WHERE id = ?`, [changedOrder.packageStatus, changedOrder.items, changedOrder.id]);
    
            }
    
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
    
         
    
    
              for(const emailData of data){
               await dbConnection.query(`UPDATE emails SET title = ?, text = ? WHERE id = ?`,[
                  emailData.title,
                  emailData.text,
                  emailData.id]
                  );
    
              }
           
            
            

          }
    
    
    
    
    
       
    
    
    
    
    
    
    
    
    
    
    
    
    
         
            else if (table === "reviews" ) {
    
    
    
    
    
              //factor which determains for how much ids moves.
    
              const productId =   (await dbConnection.query(`SELECT product_id FROM reviews WHERE id = ${data[0].id}`))[0].product_id;
    
    
    
    
            
    
              for (let i = 0; i < data.length; i++) {
    
          
    
    
    
                
                console.log('upao u save db', data, productId)
    
    
         
              
    
                const reviewProductImages = JSON.parse((await dbConnection.query(`SELECT imageNames FROM reviews WHERE id = ${data[i].id}`))[0].imageNames)
           
                
    
    
    
              if (data[i].deleted) {
    
                
                  //imageNames
              deleteOrRecoverImages(reviewProductImages, productId, true)
    
               
    
              await dbConnection.query('DELETE FROM reviews WHERE id = ?', [data[i].id]);
              await dbConnection.query('UPDATE reviews SET id = id - 1 WHERE id > ?', [data[i].id]);
              
              console.log('Deleted. Now minus');
              
              // Adjust the `id` values for remaining data entries
              data.slice(i + 1).forEach((item) => item.id--);
              
              console.log('deleted', data[i].deleted);
    
    
              } 
              
              
              




              
              else {
    
    
                console.log('checking data of i imagenames', data[i].imageNames)
                  //nije imageNames
                  const updatedReviewImages = JSON.parse(data[i].imageNames || '[]') || [];
    
                  
                  const deletedImages = reviewProductImages?.filter(img => !updatedReviewImages.includes(img));
    
                deleteOrRecoverImages(deletedImages, productId, false);
                

    
                const recycledReviewImages = updatedReviewImages?.filter(img => !reviewProductImages.includes(img));

          
          console.log('recycled Review Images, data', recycledReviewImages, data);
    
            deleteOrRecoverImages(recycledReviewImages, productId, true)

            
            
            const newImageNames = updatedReviewImages.length ? JSON.stringify(updatedReviewImages) : null;

            
            
            

    
                await dbConnection.query(`UPDATE reviews SET name = ?, text = ?, imageNames = ?, stars = ? WHERE id = ?`, [
                  data[i].name,
                  data[i].text,
                  newImageNames,
                  data[i].stars,
                  data[i].id
                ]
                );
    
    
    
    
    




    
                if (data[i].swapId) {
    
    
    
    
                  const swappingTargetRow = (await dbConnection.query(`SELECT * FROM reviews WHERE id = ?`, [data[i].id]))[0];
              
                  const swapRow = (await dbConnection.query(`SELECT * FROM reviews WHERE id = ?`,[data[i].swapId]))[0];


                  if (!swapRow) {
                    return await resReturn(500, { successfulLogin: false, error: "Swap id doesn't exist." });
                  }

                  const updateQuery = `UPDATE reviews SET name = ?, text = ?, stars = ?, imageNames = ? WHERE id = ?`;
    
                  await dbConnection.query(updateQuery, [swapRow.name, swapRow.text, swapRow.stars, swapRow.imageNames, data[i].id]);
                  await dbConnection.query(updateQuery, [swappingTargetRow.name, swappingTargetRow.text, swappingTargetRow.stars, swappingTargetRow.imageNames, data[i].swapId]);
               
    

    
                }


    
    
                
              }
              console.log('proso delete stat')
    
            }
    
    
                               await revalidateReviews();
    
                              } 



                              

            else if(table==="products"){

              await dbConnection.query(
                `INSERT INTO products (productId, description) 
                 VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE description = VALUES(description)`,
                [data.productId, data.text]
              );

              return await resReturn(200, { descriptionUpdated: true })


            }
           
            
           
          
    
        
    
            return await resReturn(200, { data_saved: true })
       
    
        
            
    
         
     
            
    
    
      
    

    

}

module.exports = updateDb;