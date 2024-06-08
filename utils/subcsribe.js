import betterSqlite3 from "better-sqlite3";
import emailSendJob from "./sendEmailJob";


function subscribe(email, source, extraData) {




  try{



    const db = betterSqlite3(process.env.DB_PATH);


    


   
    const sendThankYouEmail = (totalOrderCount)=>{

      console.log('checking totalOrderCount', totalOrderCount)

     
      let result;

      if(totalOrderCount===1){

        result = db.prepare(`INSERT INTO email_campaigns (title, sequenceId, sendingDateInUnix, emailSentCounter, retryCounter, targetCustomers, extraData) VALUES (?, ?, ?, ?, ?, ?, ?)`)
        .run(
          `Thank you ${email}`,
          process.env.THANK_YOU_SEQUENCE_FIRST_ORDER_ID,
          Date.now()+60000,
          0,
          0,
          JSON.stringify([email]),
          JSON.stringify({orderId: extraData.orderId})
          
        );
       

      }

      else{
        result = db.prepare(`INSERT INTO email_campaigns (title, sequenceId, sendingDateInUnix, emailSentCounter, retryCounter, targetCustomers, extraData) VALUES (?, ?, ?, ?, ?, ?, ?)`)
        .run(
          `Thank you ${email}`,
          process.env.THANK_YOU_SEQUENCE_ID,
          Date.now()+60000,
          0,
          0,
          JSON.stringify([email]),
          JSON.stringify({orderId: extraData.orderId})
          
        );
      }

      
    
   
    
            const campaignId = result.lastInsertRowid;
    
         console.log('in thank you, thank you campaign set for email', email)
    
    
            emailSendJob(Date.now()+60000,campaignId);
    }






    
const startCampaign = ()=>{



  


  const result = db.prepare(`INSERT INTO email_campaigns (title, sequenceId, sendingDateInUnix, emailSentCounter, retryCounter, targetCustomers) VALUES (?, ?, ?, ?, ?, ?)`)
  .run(
    `Welcome ${email}`,
    process.env.WELCOME_SEQUENCE_ID,
    Date.now()+60000,
    0,
    0,
    JSON.stringify([email])
   
    
  );
   

        const campaignId = result.lastInsertRowid;

     


        emailSendJob(Date.now()+60000,campaignId);
}





    
   



   

       const result = db.prepare("SELECT totalOrderCount FROM customers WHERE email = ?").get(email);
        
    
        if(!result){

          db.prepare("INSERT INTO customers (email, totalOrderCount, subscribed, source) VALUES (?, ?, ?, ?)").run( email, source.includes('checkout')?1:0, source==='checkout x'?0:1, source );
      
          if(source.includes('checkout')) sendThankYouEmail(1);
          if(source!='checkout x')startCampaign();
      
        }



        
        

        else {


          if(source==="checkout"){
            db.prepare("UPDATE customers SET totalOrderCount = totalOrderCount + 1, subscribed = 1 WHERE email = ?").run( email);    
            console.log('in source checkout,', result.subscribed)
            if(!result.subscribed) startCampaign();
            sendThankYouEmail(result.totalOrderCount+1);
       
          }

          else  if(source==="checkout x"){ 

              db.prepare("UPDATE customers SET totalOrderCount = totalOrderCount + 1 WHERE email = ?").run(email);
              sendThankYouEmail(result.totalOrderCount+1);
          }

            else{


              db.prepare("UPDATE customers SET subscribed = 1 WHERE email = ?").run(email);
          
              if(!result.subscribed) startCampaign();

            }

        
        }

    console.log("Successfully subscribed.");
   

    // Close the database connection when done
    db.close();

    return true;

      }

      catch(error){
        console.log('subscribe error', error)
      }



}






module.exports =  subscribe;