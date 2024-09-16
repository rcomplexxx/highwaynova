const deleteRow= async(dbConnection, resReturn, tableName, deleteId)=>{


    try {

    console.log('deleting data row from', tableName, deleteId)
  
    

    if(tableName==='email_sequences')
    await dbConnection.query(`DELETE FROM email_campaigns WHERE sequenceId = ?`, [deleteId]);
  

    else if(tableName === 'emails'){

      const sequencesToDelete = await dbConnection.query(
        `SELECT id FROM email_sequences WHERE JSON_CONTAINS(emails, JSON_OBJECT('id', ?), '$')`,
        [deleteId]
      );

      

      for(const seq of sequencesToDelete){
        await dbConnection.query(`DELETE FROM email_campaigns WHERE sequenceId = ?`, [seq.id]);
        await dbConnection.query(`DELETE FROM email_sequences WHERE id = ?`, [seq.id]);
      }

     
     

    }

    else if(tableName === "product_returns"){

        
      const orderId = (await dbConnection.query(`SELECT orderId FROM product_returns WHERE id = ?`,[deleteId]))[0].orderId;

     

  



      //Menja packageStatus ordera u prethodni(packageStatus pre nego da je packageStatus postao 'returned') ako je 
      //ovo poslednji izbrisani return(za to se brine subQuery nakon AND)
     
     await dbConnection.query(`
         UPDATE orders 
  SET packageStatus = (
    SELECT prevPackageStatus 
    FROM product_returns 
    WHERE id = ?
  ) 
  WHERE id = ? 
  AND (
    SELECT COUNT(*) 
    FROM product_returns 
    WHERE orderId = ?
  ) = 1`, [deleteId, orderId, orderId]);


    
      

      

        //Sracunava kolko para je potrosio kod mene customer nakon povratka novca
      await dbConnection.query(`
        UPDATE customers 
        SET money_spent = ROUND(money_spent - (
            SELECT r.returnCost
            FROM product_returns r
            
            WHERE r.id = ?
        ), 2) 
        WHERE id = (
            SELECT o.customer_id
            FROM orders o
            
            WHERE o.id = ?
        )
    `, [deleteId, orderId]);


    


    }





    await dbConnection.query(`DELETE FROM ${tableName} WHERE id = ?`,[deleteId]);
    

   return await resReturn(200, { row_deleted: true })
  

   
  } catch (error) {
    console.error(error);

    return await resReturn(500, { successfulLogin: false, error: "Database update error" })
   
    

    
  }
    
  }


  
module.exports = deleteRow;