
import RateLimiter from "@/utils/rateLimiter.js";
import subscribe from '@/utils/subcsribe.js'
const getPool = require('../../utils/mariaDbPool');



const limiterPerMinute = new RateLimiter({
  apiNumberArg: 0,
  tokenNumberArg: 6,
  expireDurationArg: 86400, //secs
});

const dailyMessageLimit = new RateLimiter({
  apiNumberArg: 1,
  tokenNumberArg: 4,
  expireDurationArg: 60, //secs
});

const limiterPerWeek = new RateLimiter({
  apiNumberArg: 2,
  tokenNumberArg: 40,
  expireDurationArg: 604800, //secs
});

export default async function handler(req, res) {






  let dbConnection = await getPool().getConnection();


  

  
  const resReturn = async(statusNumber, jsonObject)=>{

    if(dbConnection)await dbConnection.release();
    res.status(statusNumber).json(jsonObject)
   
 }

  
  try {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Perform rate limiting checks

    


    if (!(await limiterPerMinute.rateLimiterGate(clientIp, dbConnection)))
   return await resReturn(429, { error: "Too many requests." })


     
    if (!(await limiterPerWeek.rateLimiterGate(clientIp, dbConnection)))
      return await resReturn(429, { error: "Too many requests." })

    // Rate limiting checks passed, proceed with API logic

    if (req.method === "POST") {
      // Handle POST requests here
      try {
        if (!req.body.type) return;

        if (req.body.type === "customers") {
          // Create a new SQLite database connection

          if(await subscribe(req.body.email, req.body.source, dbConnection))
            return await resReturn(201, { message: "Successfully subscribed." })
            
          

        
        } else if (req.body.type === "messages") {
          // Create a new SQLite database connection


          if (!(await dailyMessageLimit.rateLimiterGate(clientIp, dbConnection)))
            
              return await resReturn(429, { error: "Too many messages sent." })
           
     
            
        

         

          // Ensure the messages table exists

          const { email, name, message } = req.body.message;

              
         


            let customerId = (await dbConnection.query(`SELECT id FROM customers WHERE email = ? LIMIT 1`, [email]))[0]?.id;

          if(!customerId)
            customerId =(await dbConnection.query(`INSERT INTO customers (email, totalOrderCount, subscribed, source) VALUES (?, ?, ?, ?)`, [email, 0, 0, 'message' ])).insertId;






     

          // Assuming you have the message data in the request body
       

          // Insert message data into the messages table
          await dbConnection.query(
            `INSERT INTO messages (customer_id, name, message) VALUES (?, ?, ?)`,
          [customerId, name, message]);

          console.log("Message sent successfully.");

          return await resReturn(201, { message: "Message sent successfully." })

     
          
        
        }
      } catch (error) {
        console.error("Error handling POST request:", error);

        return await resReturn(500, { error: "Internal Server Error" })

        
       
      }
    } else {

      return await resReturn(405, { error: "Method Not Allowed" })

      
     
    }
  } catch (error) {
    console.error("Error handling request:", error);

    return await resReturn(500, { error: "Internal Server Error"  })

    
    
  }
}
