// Import necessary functions for token generation and password verification
import hashData from "@/utils/hashData";
import RateLimiter from "@/utils/rateLimiter.js";
import betterSqlite3 from "better-sqlite3";

const limiterPerHour = new RateLimiter({
  apiNumberArg: 9,
  tokenNumberArg: 10,
  expireDurationArg: 3600, //secs
});

export default async function unsubscribe(req, res) {


  const resReturn = (statusNumber, jsonObject, db)=>{

    console.log('returning res', statusNumber, jsonObject);

     
    res.status(statusNumber).json(jsonObject)
    if(db)db.close();
 }


const {customer_id, customer_hash} = req.body;

 const db = betterSqlite3(process.env.DB_PATH);
 

  
  try {

    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // if (!(await limiterPerHour.rateLimiterGate(clientIp)))
    //   return resReturn(429, { success: true, error: "server_error" } ,db)
     

    console.log(Number(customer_id), 'welcome')
      const customer = db.prepare(`SELECT email FROM customers WHERE id = ?`).get(Number(customer_id));

      if(!customer.email) return resReturn(400, { success: false, error: "customer_not_found" } ,db)

        



      const saltedInput = customer.email + customer_id;
      const hashVerified =  hashData(saltedInput);
    
      console.log('customers hash is', customer_hash, 'server hash found', hashVerified);

      if(hashVerified !== customer_hash){
        
        return resReturn(400, { success: false, error: 'customer_unverified' } ,db)
      
      }

  

    db.prepare('UPDATE customers SET subscribed = 0 WHERE id = ?').run(customer_id);
 
  




       const allCampaigns = db.prepare(`SELECT id, targetCustomers FROM email_campaigns`).all();

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
       
       customersCampaigns.forEach(campaign => {
         db.prepare(`UPDATE email_campaigns SET targetCustomers = ? WHERE id = ?`).run(campaign.targetCustomers, campaign.id);
       });
      


      return resReturn(200, { success: true, message: "Unsubscribed successfuly" } ,db)
   
  




 
   






   


  } catch (e) {
    return resReturn(500, { success: false, error: e } ,db)
  }
}
