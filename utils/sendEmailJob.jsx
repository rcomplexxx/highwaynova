const cron = require('node-cron');
const betterSqlite3 = require('better-sqlite3');
const nodemailer = require("nodemailer");




 async function emailSendJob( dateInUnix, campaignId) {


//

   



  


const date =formatDateToCron(new Date(dateInUnix));
console.log('setting email cron scheduler', date)

cron.schedule(date, async() => {
  console.log('Send email here');
 
  
    try{

        const db = betterSqlite3(process.env.DB_PATH);
    const campaign= db.prepare(`SELECT * FROM email_campaigns WHERE id = ?`, campaignId).get(campaignId);

    const currentEmailIndex = campaign.emailSentCounter

    let sequenceEmailPointers = db.prepare(`SELECT emails from email_sequences WHERE ID = ?`).get(campaign.sequenceId);
    console.log('sequenceEmailPOinters', sequenceEmailPointers)
    if(sequenceEmailPointers)sequenceEmailPointers= JSON.parse(sequenceEmailPointers.emails);
    console.log('sequenceEmailPOinters', sequenceEmailPointers)

    
    







 
console.log('CAMPAIGN ID!!!!!!!!!!!!!! IS', campaignId)
   
  


   
    

      

    

        const email = db.prepare(`SELECT * FROM emails WHERE id = ?`).get(sequenceEmailPointers[currentEmailIndex].id);


        




    


          //Za sad gadjam sve subscribere.
      
         
         
         
         
         
         
         
          let targets;

          const campaignTargets= campaign.targetCustomers;

       
         
          if(campaignTargets==='cold_traffic'){
            targets= db.prepare(`SELECT * FROM customers WHERE subscribed = ? AND totalOrderCount <= 1`).all(1)?.map(target=>{return target.email});

          }
            else if(campaignTargets==='warm_traffic'){
              targets= db.prepare(`SELECT * FROM customers WHERE subscribed = ? AND totalOrderCount = 2`).all(1)?.map(target=>{return target.email});

            }
              else if(campaignTargets==='hot_traffic') {
                targets= db.prepare(`SELECT * FROM customers WHERE subscribed = ? AND totalOrderCount >= 3 AND totalOrderCount <5`).all(1)?.map(target=>{return target.email});

              } 
              else if(campaignTargets==='loyal_traffic'){

                targets= db.prepare(`SELECT * FROM customers WHERE subscribed = ? AND totalOrderCount >= 5`).all(1)?.map(target=>{return target.email});

              }

              else  if(campaignTargets==='all'){
                targets= db.prepare(`SELECT * FROM customers WHERE subscribed = ?`).all(1)?.map(target=>{return target.email});
              }
              else if(campaignTargets==='bh_customers'){
             
              targets = db.prepare(`SELECT * FROM customers WHERE subscribed = ?`).all(0)?.map(target=>{return target.email});
              }
              else{
                  targets = JSON.parse(campaignTargets);
              }
         
         
         
              console.log('campaigntargets', campaignTargets, 'targets', targets)

         
         
         
         
         
         
        



          

            try {

          




              

              const transporter = nodemailer.createTransport({
                service: "hotmail",
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASSWORD,
                },
              });
    
              await transporter.sendMail({
                //   from: 'orderconfirmed@selling-game-items-next.com',
                from: process.env.EMAIL_USER,
                to: targets,
                subject: email.title,
                html: email.text,
              });



              let sendTimeGap = parseInt(sequenceEmailPointers[currentEmailIndex+1]?.sendTimeGap);
              if(!sendTimeGap || isNaN(sendTimeGap)) sendTimeGap = 0;
        
            let dateCalculated = campaign.sendingDateInUnix;
            sequenceEmailPointers.forEach((emailPointer, index) =>{
            
              if(index!==0 && index < currentEmailIndex+1)
              dateCalculated = dateCalculated + parseInt(emailPointer.sendTimeGap);
           
        
            })




              let   finalSendingDate=(Date.now() - dateCalculated > 0)?
              Date.now()+sendTimeGap: dateCalculated+sendTimeGap;



              
        if(currentEmailIndex < sequenceEmailPointers.length)
          {
            console.log(`SCHEDULING NEXT EMAIL!!!!!!!!`, new Date(finalSendingDate) , new Date())

            await emailSendJob( finalSendingDate, campaignId)
          }




      db.prepare(`UPDATE email_campaigns SET emailSentCounter = ?, retryCounter = ? WHERE id = ?`).run(
        campaign.emailSentCounter + 1,
        0,
          campaign.id,
        );



            }
            
            
            
            catch (error) {
              console.error("Email not sent, trying again.", error,`/n retryCounter is`, campaign.retryCounter+1);

           

             

                db.prepare(`UPDATE email_campaigns SET retryCounter = ? WHERE id = ?`).run(
                  campaign.retryCounter + 1,
                    campaign.id,
                  );
                  

                  if( campaign.retryCounter<10)
              
                await  emailSendJob( (campaign.retryCounter+1)%3===0?Date.now()+10800000:Date.now()+60000, campaignId)
            }
         
            
            db.close();

           

          

        console.log('here should be sent email with index', sequenceEmailPointers[currentEmailIndex])

        //Here email
    }
    catch(error){
        console.log('cron error', error)
    }
 
       





}
);


 }



 function formatDateToCron(date) {
    console.log('date is', date)
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1; // Note: Months are zero-indexed in JavaScript
    const dayOfWeek = date.getDay();

    return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
}



 module.exports = emailSendJob;