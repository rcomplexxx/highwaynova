import betterSqlite3 from "better-sqlite3";
import emailSendJob from "./sendEmailJob";


function subscribe(email, source) {




  try{



    const db = betterSqlite3(process.env.DB_PATH);


    


   







    
const startCampaign = (email)=>{






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





    
   



   

       const result = db.prepare("SELECT * FROM customers WHERE email = ?").get(email);
        
    
        if(!result){




    //bh subscriberi(customeri)


    if(source==="checkout"){ 
      db.prepare("INSERT INTO customers (email, totalOrderCount, subscribed, source) VALUES (?, ?, ?, ?)").run( email, 1, 1, source );
      startCampaign(email);
     
     

      
  }

      else if(source==="checkout x"){ 
            db.prepare("INSERT INTO customers (email, totalOrderCount, subscribed, source) VALUES (?, ?, ?, ?)").run( email, 1, 0, source );
          
   
        }




    else{
          
    db.prepare("INSERT INTO customers (email, totalOrderCount, subscribed, source) VALUES (?, ?, ?, ?)").run(
        email,
        0,
        1,
      source
    );


    startCampaign(email);

  }






        }

        else {


          if(source==="checkout"){
            db.prepare("UPDATE customers SET totalOrderCount = totalOrderCount + 1, subscribed = 1 WHERE email = ?").run( email);    
            console.log('in source checkout,', result.subscribed)
            if(!result.subscribed) startCampaign(email);

       
          }

          else  if(source==="checkout x"){ 

              db.prepare("UPDATE customers SET totalOrderCount = totalOrderCount + 1 WHERE email = ?").run(email);
           
          }

            else{


              db.prepare("UPDATE customers SET subscribed = 1 WHERE email = ?").run(email);
          
              if(!result.subscribed) startCampaign(email);

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