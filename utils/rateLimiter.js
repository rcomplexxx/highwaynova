import betterSqlite3 from 'better-sqlite3';

class RateLimiter {

 

    //doraditi u zavisnosti od mog api numbera
  


    constructor({apiNumberArg, tokenNumberArg, expireDurationArg}) {
        const db = betterSqlite3(process.env.DB_PATH);

    

        db.close();
            this.apiNumber=apiNumberArg;
            this.tokenNumber = tokenNumberArg;
            this.expireDuration = expireDurationArg;


        
    }

    async rateLimiterGate (ipArg )  {

  

      return new Promise((resolve, reject) => {
        const db= betterSqlite3(process.env.DB_PATH);
          try {
         
  
              const existingRecord = db.prepare(`
                  SELECT * FROM rateLimiter WHERE ip = ? AND apiNumber = ?
              `).get(ipArg, this.apiNumber);
  
              if (existingRecord) {
                  if (existingRecord.tokenNumber === 0) {
  
                    if(Math.floor(Date.now() / 1000)>existingRecord.expireDate)
                    {
  
                     
  
                     
                      db.prepare(`
                      UPDATE rateLimiter 
                              SET tokenNumber = ?, expireDate = ? 
                              WHERE id = ?
                  `).run(this.tokenNumber - 1, Math.floor(Date.now() / 1000) + this.expireDuration, existingRecord.id);
                  resolve(true);
                      
  
  
                    }
  
  
                     resolve(false);
                  } else {
  
                    
                      db.prepare(`
                          UPDATE rateLimiter SET tokenNumber = ? WHERE ip = ? AND apiNumber = ?
                      `).run(existingRecord.tokenNumber - 1, ipArg, this.apiNumber);
                      resolve(true);
                  }
              } else {
  
  
              
  
                  db.prepare(`
                      INSERT INTO rateLimiter (ip, tokenNumber, apiNumber, expireDate) VALUES (?, ?, ?, ?)
                  `).run(ipArg, this.tokenNumber - 1, this.apiNumber, Math.floor(Date.now() / 1000) + this.expireDuration);
                  resolve(true);
              }
          } catch (error) {
              console.error('Error in database operations:', error);
              reject('Error in database operations.');
          } finally {
              db.close();
          }
      });
}
}

export default RateLimiter;


      