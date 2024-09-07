const getPool = require('./mariaDbPool');




class RateLimiter {

 

    //doraditi u zavisnosti od mog api numbera
  


    constructor({apiNumberArg, tokenNumberArg, expireDurationArg}) {
     
        
            this.apiNumber=apiNumberArg;
            this.tokenNumber = tokenNumberArg;
            this.expireDuration = expireDurationArg;


        
    }

    async rateLimiterGate (ipArg, dbConnectionArg )  {

  

        const dbConnection= dbConnectionArg?dbConnectionArg:await getPool().getConnection();;



    
      
          try {
         
  
              const existingRecord = (await dbConnection.query(`
                  SELECT id, tokenNumber, expireDate  FROM rateLimiter WHERE ip = ? AND apiNumber = ?
              LIMIT 1`,[ipArg, this.apiNumber]))[0];
  
              if (existingRecord) {
                  if (existingRecord.tokenNumber === 0) {
  
                    if(Math.floor(Date.now() / 1000)>existingRecord.expireDate)
                    {
  
                     
  
                     
                      await dbConnection.query(`
                      UPDATE rateLimiter 
                              SET tokenNumber = ?, expireDate = ? 
                              WHERE id = ?
                  `, [this.tokenNumber - 1, Math.floor(Date.now() / 1000) + this.expireDuration, existingRecord.id]);
                  
                  return true;
                      
  
  
                    }
  
  
                     return false;
                  } else {
  
                    
                      await dbConnection.query(`
                          UPDATE rateLimiter SET tokenNumber = ? WHERE ip = ? AND apiNumber = ?
                      `, [existingRecord.tokenNumber - 1, ipArg, this.apiNumber]);
                      return true;
                  }
              } else {
  
  
              
  
                 await dbConnection.query(`
                      INSERT INTO rateLimiter (ip, tokenNumber, apiNumber, expireDate) VALUES (?, ?, ?, ?)
                  `,[ipArg, this.tokenNumber - 1, this.apiNumber, Math.floor(Date.now() / 1000) + this.expireDuration]);
                  return true;
              }
          } catch (error) {
              console.error('Error in database operations:', error);
              return false;
          } finally {
              if(!dbConnectionArg && dbConnection)await dbConnection.release();
          }
     
}
}

export default RateLimiter;


      