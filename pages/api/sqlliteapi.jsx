
import RateLimiter from "@/utils/utils-server/rateLimiter.js";
import sendEssencialSequence from '@/utils/utils-server/sendEssencialSequence.js'
const getPool = require('@/utils/utils-server/mariaDbPool');



const limiterPerDay = new RateLimiter({
  apiNumberArg: 0,
  tokenNumberArg: 6,
  expireDurationArg: 86400, //secs
});

const minuteMessageLimit = new RateLimiter({
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






let dbConnection;


  

  
  const resReturn = async(statusNumber, jsonObject)=>{

    res.status(statusNumber).json(jsonObject)
   
 }

  
  try {




    dbConnection = await getPool().getConnection();




    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    


  //   if (!(await limiterPerDay.rateLimiterGate(clientIp, dbConnection)))
  //  return await resReturn(429, { error: "Too many requests." })


     
  //   if (!(await limiterPerWeek.rateLimiterGate(clientIp, dbConnection)))
  //     return await resReturn(429, { error: "Too many requests." })

   
  

    
    
        if (!req.body.type)  throw new Error('Request type not provided')

          if (req.body.type === "subscribe") {
            const success = await sendEssencialSequence(req.body.email, req.body.source, undefined, dbConnection);
            return resReturn(success ? 201 : 500, { message: success ? "Successfully subscribed." : "Internal Server Error" });
          }

        
        else if (req.body.type === "message") {
    
          


          if (!(await minuteMessageLimit.rateLimiterGate(clientIp, dbConnection))) 
            return await resReturn(429, { error: "Too many messages sent." })
           
     
            
        

         

          // Ensure the messages table exists

          const { email, name, message } = req.body.message;

              
         


            let customerId = (await dbConnection.query(`SELECT id FROM customers WHERE email = ? LIMIT 1`, [email]))[0]?.id;

          if(!customerId) customerId =(await dbConnection.query(`INSERT INTO customers (email, totalOrderCount, subscribed, source, createdDate) VALUES (?, ?, ?, ?, ?)`, [email, 0, 0, 'message', Date.now()])).insertId;






     

          // Assuming you have the message data in the request body
       

          // Insert message data into the messages table
          await dbConnection.query(
            `INSERT INTO messages (customer_id, name, message, createdDate) VALUES (?, ?, ?, ?)`,
          [customerId, name, message, Date.now()]);

          

          return await resReturn(201, { message: "Message sent successfully." })

     
          
        
        }
        

        return await resReturn(500, { error: "Internal Server Error"  })


       
      
   
  } 
  
  
  catch (error) {
    console.error("Error handling request:", error);

    return await resReturn(500, { error: "Internal Server Error"  })

    
    
  }

  finally{
    
    if(dbConnection)await dbConnection.release();
  }
}
