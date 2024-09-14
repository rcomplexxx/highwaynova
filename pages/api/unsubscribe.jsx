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

    if(dbConnection) await dbConnection.release();
    res.status(statusNumber).json(jsonObject)
  
 }


const {customer_id, customer_hash} = req.body;


 

  
  try {

    

    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (!(await limiterPerHour.rateLimiterGate(clientIp)))
      return await resReturn(429, { success: true, error: "server_error" })


    dbConnection = await getPool().getConnection();
     

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
 
  




       const allCampaigns = await dbConnection.query(`SELECT id, targetCustomers FROM email_campaigns`);

       let customersCampaigns = allCampaigns.filter(campaign => 
         campaign.targetCustomers.includes(customer.email)
       ).map(campaign => {
         return {
           ...campaign,
           targetCustomers: JSON.stringify(JSON.parse(campaign.targetCustomers).filter(tc => tc !== customer.email))
         };
       }).filter(campaign => {
        if(campaign.targetCustomers === '[]'){
          db.prepare(`DELETE FROM email_campaigns WHERE id = ?`).run(campaign.id);
          return false;
        }
        return true;
       });


       for(const campaign of customersCampaigns){
        await  dbConnection.query(`UPDATE email_campaigns SET targetCustomers = ? WHERE id = ?`, [campaign.targetCustomers, campaign.id]);
       }
       
    


      return await resReturn(200, { success: true, message: "Unsubscribed successfuly" })
   
  




 
   






   


  } catch (e) {
    return await resReturn(500, { success: false, error: e } )
  }
}
