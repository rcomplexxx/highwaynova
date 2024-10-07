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

    
    files.forEach(file => {
       
      

        // Delete the file or directory
        fs.rmSync(path.join(folderPath, file), { recursive: true, force: true });
    });

    
    fs.rmdirSync(folderPath);
}










const wipeData = async(dbConnection, resReturn, tableName, product_id)=>{



  

      console.log('reviews wipiong', tableName, product_id)
  
      

      if(tableName==='reviews'){

  
        
        
        if (product_id == 'all') {
          const product_ids = (await dbConnection.query('SELECT DISTINCT product_id FROM reviews')).map(row => row.product_id);

          product_ids.forEach(product_id => deleteReviewImageFolder(product_id));
        
          
          await dbConnection.query(`DROP TABLE IF EXISTS reviews`);
        } else {
          const deletedItemsNumber=  (await dbConnection.query(`SELECT COUNT(id) as count FROM reviews WHERE product_id = ?`, [product_id]))[0]?.count || 0;

          deleteReviewImageFolder(product_id);
          await dbConnection.query(`DELETE FROM reviews WHERE product_id = ?`, [product_id]);
        
          await dbConnection.query(`UPDATE reviews SET id = id - ? WHERE product_id > ?`, [deletedItemsNumber, product_id]);
        }
        }









        else{

          if(tableName==='customers'){

            try{ await dbConnection.query(`DROP TABLE IF EXISTS product_returns`); }
            catch(error){console.log('Error deleting product_returns', error);}

            try{ await dbConnection.query(`DROP TABLE IF EXISTS orders`); }
            catch(error){console.log('Error deleting orders', error);}

            try{ await dbConnection.query(`DROP TABLE IF EXISTS messages`); }
            catch(error){console.log('Error deleting messages', error);}
              
            try{  await dbConnection.query(`DROP TABLE IF EXISTS email_campaigns`);}
           catch(error){console.log('Error deleting email_campaigns', error);}
             

          
          }

          else if(tableName==='orders'){

            try{ await dbConnection.query(`DROP TABLE IF EXISTS product_returns`); }
              catch(error){console.log('Error deleting product_returns', error);}

          }



          else if (tableName ==='emails'){

            try{  await dbConnection.query(`DROP TABLE IF EXISTS email_campaigns`);}
            catch(error){console.log('Error deleting email_campaigns', error);}

            try{await dbConnection.query(`DROP TABLE IF EXISTS email_sequences`);}
            catch(error){console.log('Error deleting email_campaigns', error);}


          }


          else if (tableName ==='email_sequences'){

            try{  await dbConnection.query(`DROP TABLE IF EXISTS email_campaigns`);}
            catch(error){console.log('Error deleting email_campaigns', error);}

          }

        
        

          
         await dbConnection.query(`DROP TABLE IF EXISTS ${tableName}`);



        }
       


        await createSqliteTables();//

        return await resReturn(200, { data_wiped: true })
   

     
    
        
  }

 
module.exports = wipeData;