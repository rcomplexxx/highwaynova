const getFromDb = async(dbConnection, resReturn, table, queryCondition=true, selectVariables='*') => {



    try {
     
      let rows;

      if(table==="emails"){
        
       const rows1 = await dbConnection.query(`SELECT * FROM emails`);


       const rows2 = await dbConnection.query(`SELECT * FROM email_sequences`);

     
        
       const rows3 = await dbConnection.query(`SELECT * FROM email_campaigns`);
      
       
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


  
module.exports = getFromDb;