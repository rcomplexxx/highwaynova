import betterSqlite3 from "better-sqlite3";
import RateLimiter from "@/utils/rateLimiter.js";
import subscribe from '@/utils/subcsribe.js'

const limiterPerMinute = new RateLimiter({
  apiNumberArg: 8,
  tokenNumberArg: 6,
  expireDurationArg: 86400, //secs
});

const dailyMessageLimit = new RateLimiter({
  apiNumberArg: 0,
  tokenNumberArg: 4,
  expireDurationArg: 60, //secs
});

const limiterPerWeek = new RateLimiter({
  apiNumberArg: 1,
  tokenNumberArg: 40,
  expireDurationArg: 604800, //secs
});

export default async function handler(req, res) {

  
  const resReturn = (statusNumber, jsonObject, db)=>{

     
    res.status(statusNumber).json(jsonObject)
    if(db)db.close();
 }

  
  try {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Perform rate limiting checks

    const db = betterSqlite3(process.env.DB_PATH);


    if (!(await limiterPerMinute.rateLimiterGate(clientIp, db)))
   return resReturn(429, { error: "Too many requests." }, db)


     
    if (!(await limiterPerWeek.rateLimiterGate(clientIp, db)))
      return resReturn(429, { error: "Too many requests." }, db)

    // Rate limiting checks passed, proceed with API logic

    if (req.method === "POST") {
      // Handle POST requests here
      try {
        if (!req.body.type) return;

        if (req.body.type === "customers") {
          // Create a new SQLite database connection

          if(subscribe(req.body.email, req.body.source, db))
            return resReturn(201, { message: "Successfully subscribed." }, db)
            
          

        
        } else if (req.body.type === "messages") {
          // Create a new SQLite database connection


          if (!(await dailyMessageLimit.rateLimiterGate(clientIp, db)))
            
              return resReturn(429, { error: "Too many messages sent." }, db)
           
     
            
        

         

          // Ensure the messages table exists

          const { email, name, message } = req.body.message;

              
         


            let customerId =db.prepare(`SELECT id FROM customers WHERE email = ?`).get(email)?.id;

          if(!customerId)
            customerId = db.prepare(`INSERT INTO customers (email, totalOrderCount, subscribed, source) VALUES (?, ?, ?, ?)`).run(email, 0, 0, 'message' ).lastInsertRowid;






     

          // Assuming you have the message data in the request body
       

          // Insert message data into the messages table
          db.prepare(
            `INSERT INTO messages (customer_id, name, message, msgStatus) VALUES (?, ?, ?, '0')`,
          ).run(customerId, name, message);

          console.log("Message sent successfully.");

          return resReturn(201, { message: "Message sent successfully." }, db)

     
          
        
        }
      } catch (error) {
        console.error("Error handling POST request:", error);

        return resReturn(500, { error: "Internal Server Error" }, db)

        
       
      }
    } else {

      return resReturn(405, { error: "Method Not Allowed" }, db)

      
     
    }
  } catch (error) {
    console.error("Error handling request:", error);

    return resReturn(500, { error: "Internal Server Error"  }, db)

    
    
  }
}
