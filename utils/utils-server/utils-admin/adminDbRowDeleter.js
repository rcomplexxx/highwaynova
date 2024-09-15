const deleteRow= async(dbConnection, resReturn, tableName, deleteId)=>{


    try {

    console.log('deleting data row from', tableName, deleteId)
  
    

    if(tableName==='email_sequences')
    await dbConnection.query(`DELETE FROM email_campaigns WHERE sequenceId = ?`, [deleteId]);

    else if(tableName === 'emails'){

      const allSequences = await dbConnection.query(`SELECT id, emails FROM email_sequences`);


      const sequenceToDeleteIdArray = allSequences.filter((seq)=> JSON.parse(seq.emails).find(seqEmail => seqEmail.id === deleteId))


      for(const seq of sequenceToDeleteIdArray){
        await dbConnection.query(`DELETE FROM email_campaigns WHERE sequenceId = ?`, [seq.id]);
        await dbConnection.query(`DELETE FROM email_sequences WHERE id = ?`, [deleteId]);
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