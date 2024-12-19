const getFromDb = async(dbConnection, resReturn, table, queryCondition=true, selectVariables='*') => {



    try {
     



      let rows;

      if(table==="emails"){
        
       const emails = await dbConnection.query(`SELECT * FROM emails`);


       const sequences = await dbConnection.query(`SELECT * FROM email_sequences`);

     
        
       const campaigns = await dbConnection.query(`SELECT * FROM email_campaigns`);

       const specialCampaignIds =   [process.env.WELCOME_SEQUENCE_ID, process.env.THANK_YOU_SEQUENCE_ID, process.env.THANK_YOU_SEQUENCE_FIRST_ORDER_ID];
      
       
       rows= {emails, sequences,  campaigns, specialCampaignIds};

      }

    

  

else{

  

    
 

      // Fetching data from the specified table with the given query condition
     rows = await dbConnection.query(`SELECT ${selectVariables} FROM ${table} WHERE ${queryCondition}`);

    }

      // Closing the database connection







      return await resReturn(200, { data: rows })
   
      
    } catch (error) {
      console.error("Error fetching data from database:", error);

      return await resReturn(500, { successfulLogin: false, error: "No data to send" })
      
      
    }
  };


  
module.exports = getFromDb;