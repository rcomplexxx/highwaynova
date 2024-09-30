// Import necessary functions for token generation and password verification
import hashData from "@/utils/utils-server/hashData";
import RateLimiter from "@/utils/utils-server/rateLimiter.js";

const getPool = require('@/utils/utils-server/mariaDbPool');

const limiterPerHour = new RateLimiter({
  apiNumberArg: 9,
  tokenNumberArg: 10,
  expireDurationArg: 3600, //secs
});

export default async function unsubscribe(req, res) {





  let dbConnection ;




  const resReturn = async(statusNumber, jsonObject, db)=>{

    console.log('returning res', statusNumber, jsonObject);

    res.status(statusNumber).json(jsonObject)
  
 }




 

  
  try {

    
    
    dbConnection = await getPool().getConnection();

    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // if (!(await limiterPerHour.rateLimiterGate(clientIp, dbConnection)))
    //   return await resReturn(429, { success: true, error: "server_error" })


    
const {customer_id, customer_hash} = req.body;

     

    console.log(Number(customer_id), 'welcome')
      const customer = (await  dbConnection.query(`SELECT email FROM customers WHERE id = ?`, [Number(customer_id)]))[0];

      if(!customer?.email) return await resReturn(400, { success: false, error: "customer_not_found" })

        



      const saltedInput = customer.email + customer_id;
      const hashVerified =  hashData(saltedInput);
    
      console.log('customers hash is', customer_hash, 'server hash found', hashVerified);

      if(hashVerified !== customer_hash){
        
        return await resReturn(400, { success: false, error: 'customer_unverified' })
      
      }

  

   await  dbConnection.query('UPDATE customers SET subscribed = 0 WHERE id = ?', [customer_id]);
 
  

   //Nadji sve campanje koje sadrze customerov email u targetCustomers, i odma im izbaci taj email iz targetCustomers(filter) u kampanje.

   const modifiedCustomersCampaigns = (await dbConnection.query(`
    SELECT id, targetCustomers
    FROM email_campaigns
    WHERE JSON_CONTAINS(targetCustomers, JSON_QUOTE(?), '$')
  `, [customer.email])).map(campaign => {
    return {
      ...campaign,
      targetCustomers: JSON.stringify(JSON.parse(campaign.targetCustomers).filter(tc => tc !== customer.email))
    };
  });

  


  

  
       


       for(const campaign of modifiedCustomersCampaigns){


        if(campaign.targetCustomers === '[]'){
          dbConnection.query(`DELETE FROM email_campaigns WHERE id = ?`, [campaign.id]);
      
          
        }
        else await  dbConnection.query(`UPDATE email_campaigns SET targetCustomers = ? WHERE id = ?`, [campaign.targetCustomers, campaign.id]);
       }
       
    


      return await resReturn(200, { success: true, message: "Unsubscribed successfuly" })
   
  




 
   






   


  } catch (e) {
    console.log('error exists in unsub', e)
    return await resReturn(500, { success: false, error: e } )
  }

  finally{
    
    if(dbConnection) await dbConnection.release();
  }


}
