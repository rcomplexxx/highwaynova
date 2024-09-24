const getPool = require('@/utils/utils-server/mariaDbPool');




class RateLimiter {

 
    


    constructor({apiNumberArg, tokenNumberArg, expireDurationArg}) {
     
        
            this.apiNumber=apiNumberArg;
            this.tokenNumber = tokenNumberArg;
            this.expireDuration = expireDurationArg;


        
    }


    

    async rateLimiterGate (ipArg, dbConnectionArg )  {

  

        let dbConnection;



        const currentDateInDays = Math.floor(Date.now() / 1000);
    
      
          try {
         
            dbConnection = dbConnectionArg || await getPool().getConnection();


  
              const existingRecord = (await dbConnection.query(`
                  SELECT id, tokenNumber, expireDate  FROM rateLimiter WHERE ip = ? AND apiNumber = ?
              LIMIT 1`,[ipArg, this.apiNumber]))[0];


                //Ako ip/apiNumber par nikad nije zabelezen, insertirati novi db row
              if (!existingRecord) {

                       
  
                await dbConnection.query(`
                    INSERT INTO rateLimiter (ip, tokenNumber, apiNumber, expireDate) VALUES (?, ?, ?, ?)
                `,[ipArg, this.tokenNumber - 1, this.apiNumber, currentDateInDays + this.expireDuration]);

                return true;

              }

                //Ako record ima jos tokena, oduzeti jedan i dozvoliti nastavak apija 
                  if (existingRecord.tokenNumber !== 0) {


                    await dbConnection.query(`
                        UPDATE rateLimiter SET tokenNumber = tokenNumber - 1 WHERE id = ?
                      `, [existingRecord.id]);

                      return true;
                  }
                    
                //Ako record nema vise tokena, i jos nije doso expireDate, zabraniti nastavak apija(return false)
                    if(currentDateInDays <= existingRecord.expireDate) return false;
  
                   
  
                //Ako record nema vise tokena, ali je proso expireDate, ubrizgari novi paket tokena, i dozvoliti nastavak apija
                     
                      await dbConnection.query(`
                      UPDATE rateLimiter 
                              SET tokenNumber = ?, expireDate = ? 
                              WHERE id = ?
                  `, [this.tokenNumber - 1, currentDateInDays + this.expireDuration, existingRecord.id]);
          

              return true;
                      



          } catch (error) {
              console.error('Error in database operations:', error);
              return false;
          } finally {
              if(!dbConnectionArg && dbConnection)await dbConnection.release();
          }
     
}




}

export default RateLimiter;


      