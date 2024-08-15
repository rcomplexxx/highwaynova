const getPool = require('./mariaDbPool');
import emailSendJob from "./sendEmailJob";


async function subscribe(email, source, extraData,dbConnectionArg) {




  try{



    const dbConnection = dbConnectionArg?dbConnectionArg:await getPool().getConnection();


    


   
    const sendPostBuyingSequence = async(totalOrderCount)=>{

     

      const sequenceId = totalOrderCount===1?process.env.THANK_YOU_SEQUENCE_FIRST_ORDER_ID:process.env.THANK_YOU_SEQUENCE_ID;
      

     
      const campaignId = (await dbConnection.query(`INSERT INTO email_campaigns (title, sequenceId, sendingDateInUnix, emailSentCounter, retryCounter, targetCustomers, extraData) VALUES (?, ?, ?, ?, ?, ?, ?)`
        ,[
          `Thank you ${email}`,
          sequenceId,
          Date.now()+5000,
          0,
          0,
          JSON.stringify([email]),
          JSON.stringify({orderId: extraData.orderId})

        ]
          
        )).insertId;
       

      

        
    
    
         console.log('in thank you, thank you campaign set for email', email)
    
    
           await emailSendJob(Date.now()+5000,campaignId);
    }






    
const sendNewSubscriberSequence = async()=>{



  


  const campaignId = (await dbConnection.query(`INSERT INTO email_campaigns (title, sequenceId, sendingDateInUnix, emailSentCounter, retryCounter, targetCustomers) VALUES (?, ?, ?, ?, ?, ?)`,
  [
    `Welcome ${email}`,
    process.env.WELCOME_SEQUENCE_ID,
    Date.now()+5000,
    0,
    0,
    JSON.stringify([email])]
   
    
  )).insertId;



  console.log('c id',  campaignId)



      await emailSendJob(Date.now()+5000,campaignId);
}





    
   



   

       const result = (await dbConnection.query("SELECT totalOrderCount, subscribed FROM customers WHERE email = ? LIMIT 1", [email]))[0];
        
    
        if(!result){

          await dbConnection.query("INSERT INTO customers (email, totalOrderCount, subscribed, source) VALUES (?, ?, ?, ?)",
            [ email, 0, 1, source] );
      
        
          await sendNewSubscriberSequence();

          //ovde se ne pominju uslovi za checkout jer kad je checkout, customer je vec kreiran i !result nikad nije true
      
        }

        else  if(source === 're_subscribe'){
         await dbConnection.query("UPDATE customers SET subscribed = 1 WHERE email = ?", [email]); 
          if(!dbConnectionArg && dbConnection)await dbConnection.release();

          return true;
        }



        
        

        else {

           

            if(source.includes("checkout")){

              
           
              await sendPostBuyingSequence(result.totalOrderCount);

            }
              
              
        
               const newSubscribe = !result.subscribed && source!=="checkout x"
       
      

            if(newSubscribe) {
             await dbConnection.query("UPDATE customers SET subscribed = 1 WHERE email = ?", [email]); 
              await sendNewSubscriberSequence();
             
            }

    console.log("Successfully subscribed. Is person new subscriber?", newSubscribe, email );
   

 

      }


         // Close the database connection when done
         if(!dbConnectionArg && dbConnection)await dbConnection.release();

    return true;



    }

      catch(error){
        console.log('subscribe error', error);
        return false;
      }



}






module.exports =  subscribe;