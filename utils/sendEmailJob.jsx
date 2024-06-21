const cron = require('node-cron');
const betterSqlite3 = require('better-sqlite3');
const nodemailer = require("nodemailer");





 async function emailSendJob( dateInUnix, campaignId) {


//

   



  


const date =formatDateToCron(dateInUnix);
console.log('setting email cron scheduler', date)

cron.schedule(date, async() => {
  console.log('Send email here');
 
  
    try{
        const db = betterSqlite3(process.env.DB_PATH);



       


     






   const campaign = db.prepare(`
    SELECT ec.*, es.emails
    FROM email_campaigns ec
    JOIN email_sequences es ON ec.sequenceId = es.id
    WHERE ec.id = ?
`).get(campaignId);


console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@this is campaign data.', campaign)





    const currentEmailIndex = campaign.emailSentCounter

    const sequenceEmailPointers = JSON.parse(campaign.emails);
 





        const email = db.prepare(`SELECT * FROM emails WHERE id = ?`).get(sequenceEmailPointers[currentEmailIndex]?.id);

        if(!email) {console.log('campaign finished.'); return;}

        console.log('so here is my email', email, 'em pointers', sequenceEmailPointers )
        
        let targets= JSON.parse(campaign.targetCustomers);


        console.log('targets', targets)

         
         
              
       
      //odraditi neku foru da izvucem da li ova kampanja markuje iz campaigne
             
          

              

            
         
         
         
           

         
         
         
         
         
         
        



          

            try {

          
              const finalEmailText = finalizeEmailText(email.text, campaign.sequenceId, campaign.extraData)

               console.log('My final email text is', finalEmailText);

               
              

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
                html: finalEmailText,
              });


              if(currentEmailIndex===sequenceEmailPointers.lenght-1)
                targets.forEach(target => {
                  db.prepare(`UPDATE customers SET currentCampaign = ? WHERE email = ?`).run(
                    null,
                    target.email,
                );
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
            console.log(`SCHEDULING NEXT EMAIL FOR`, new Date(finalSendingDate))

            await emailSendJob( finalSendingDate, campaignId)
          }

          else if(campaign.sequenceId.toString() === process.env.THANK_YOU_SEQUENCE_ID || campaign.sequenceId.toString() === process.env.THANK_YOU_SEQUENCE_FIRST_ORDER_ID ||
            campaign.sequenceId.toString() === process.env.WELCOME_SEQUENCE_ID) {

          db.prepare(`DELETE FROM email_campaigns WHERE id = ?`).run(campaignId);
          
          db.close();
          return;

         }

         else{
          

           
          db.prepare(`UPDATE email_campaigns SET finished = 1 WHERE id = ?`).run(
            campaign.id
        );

         }
          




      db.prepare(`UPDATE email_campaigns SET emailSentCounter = ?, retryCounter = ? WHERE id = ?`).run(
        currentEmailIndex + 1,
        0,
          campaign.id,
        );



            }
            
            
            
            catch (error) {
              console.error("Email not sent, trying again.", error,`/n retryCounter is`, campaign.retryCounter+1);

           

             

                db.prepare(`UPDATE email_campaigns SET retryCounter = retryCounter + 1 WHERE id = ?`).run( campaign.id );
                  

                  if( campaign.retryCounter<10)
              
                await  emailSendJob( (campaign.retryCounter+1)%3===0?Date.now()+10800000:Date.now()+120000, campaignId)
        
                else {
                  
                  // reserveTargetedCustomers INTEGER DEFAULT 0,
                  // targetEvenReservedCustomers INTEGER DEFAULT 1,
                  // finished INTEGER DEFAULT 0
                  
               
                    db.prepare(`UPDATE email_campaigns SET finished = 1 WHERE id = ?`).run(
                      campaign.id
                  );
                

                }
           
              }
         
            
            db.close();

           

          
            
    }
    catch(error){


        console.log('cron error', error)
    }
 
       





}
);


 }












 function finalizeEmailText(emailText, sequenceId, campaignExtraData){

  let transformedEmailText;

 if(sequenceId.toString() === process.env.THANK_YOU_SEQUENCE_ID || sequenceId.toString() === process.env.THANK_YOU_SEQUENCE_FIRST_ORDER_ID){
   console.log('thank you campaign detected!!' );
   transformedEmailText = emailText.replace(/\[order_id\]/g, JSON.parse(campaignExtraData).orderId)
   
 }
 else{
  transformedEmailText = emailText;
 }
 return transformedEmailText;
 

}





 function formatDateToCron(date) {

  console.log('here are dates', Date.now(), date)


  let   finalSendingDate=(Date.now() - date) > 10000?
              Date.now()+60000: date;

              finalSendingDate = new Date(finalSendingDate);


    console.log('finalSendingDate is', finalSendingDate)
    const minutes = finalSendingDate.getMinutes();
    const hours = finalSendingDate.getHours();
    const dayOfMonth = finalSendingDate.getDate();
    const month = finalSendingDate.getMonth() + 1; // Note: Months are zero-indexed in JavaScript
    const dayOfWeek = finalSendingDate.getDay();

    return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
}



 module.exports = emailSendJob;