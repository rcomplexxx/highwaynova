import fs from 'fs'
const path = require('path');

import createSqliteTables from '@/utils/utils-server/createSqliteTables.js';


function  deleteReviewImageFolder(product_id) {

 
    

    const folderPath = path.join(
        process.cwd(),
        'public',
        'images',
        'review_images',
        `productId_${product_id}`
      );

    // Get a list of all files and directories in the specified directory
    const files = fs.readdirSync(folderPath);

    // Iterate over each file/directory
    files.forEach(file => {
        const filePath = path.join(folderPath, file);

        // Delete the file or directory
        fs.rmSync(filePath, { recursive: true, force: true });
    });

    // Remove the directory itself
    fs.rmdirSync(folderPath);
}






const wipeData = async(dbConnection, resReturn, tableName, product_id)=>{



    try {

      console.log('reviews wipiong', tableName, product_id)
  
      

      if(tableName==='reviews'){

        
      if (product_id == 'all'){


        const product_ids = await dbConnection.query('SELECT DISTINCT product_id FROM reviews');
       
        console.log('productids', product_ids)
        product_ids.forEach(product_id =>{
          deleteReviewImageFolder(product_id.product_id)
        })

        await dbConnection.query(`DELETE FROM reviews`);
        await dbConnection.query(`DROP TABLE IF EXISTS reviews`);
          }
          else{
            const deletedItemsNumber=  (await dbConnection.query(`SELECT COUNT(id) as count FROM reviews WHERE product_id = ?`, [product_id]))[0]?.count || 0;

           
             await dbConnection.query(`DELETE FROM reviews WHERE product_id = ?`, [product_id]);
            deleteReviewImageFolder(product_id);
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

 
module.exports = wipeData;