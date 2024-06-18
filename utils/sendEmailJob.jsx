const cron = require('node-cron');
const betterSqlite3 = require('better-sqlite3');
const nodemailer = require("nodemailer");




 async function emailSendJob( dateInUnix, campaignId, markAsCurrentCampaignInCustomers = true, targetCustomersWithoutCurrentCampaign=true) {


//

   



  


const date =formatDateToCron(new Date(dateInUnix));
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
        
        let targets= getTargets(campaign.targetCustomers, targetCustomersWithoutCurrentCampaign, db);




         
         
              
       

              if(markAsCurrentCampaignInCustomers){

                if(currentEmailIndex===0)
                targets.forEach(target => {
                  db.prepare(`UPDATE customers SET currentCampaign = ? WHERE email = ?`).run(
                    JSON.stringify({id: campaignId, finishedDate: null}),
                    target.email,
                );
                });

                else if(currentEmailIndex===sequenceEmailPointers.lenght-1 || campaign.retryCounter>=10)
                  targets.forEach(target => {
                    db.prepare(`UPDATE customers SET currentCampaign = ? WHERE email = ?`).run(
                      JSON.stringify( {id: campaignId, finishedDate: Date.now()}),
                      target.email,
                  );
                  });

              }

            
         
         
         
              console.log('targets', targets)

         
         
         
         
         
         
        



          

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

            await emailSendJob( finalSendingDate, campaignId, markAsCurrentCampaignInCustomers, targetCustomersWithoutCurrentCampaign)
          }

          else if(campaign.sequenceId.toString() === process.env.THANK_YOU_SEQUENCE_ID || campaign.sequenceId.toString() === process.env.THANK_YOU_SEQUENCE_FIRST_ORDER_ID ||
            campaign.sequenceId.toString() === process.env.WELCOME_SEQUENCE_ID) {

          db.prepare(`DELETE FROM email_campaigns WHERE id = ?`).run(campaignId);
          
          db.close();
          return;

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
              
                await  emailSendJob( (campaign.retryCounter+1)%3===0?Date.now()+10800000:Date.now()+120000, campaignId, markAsCurrentCampaignInCustomers, targetCustomersWithoutCurrentCampaign )
        
           
              }
         
            
            db.close();

           

          
            
    }
    catch(error){
        console.log('cron error', error)
    }
 
       





}
);


 }




 function getTargets(campaignTargets, targetCustomersWithoutCurrentCampaign, db){
  


  let targets;
 
  if(campaignTargets==='cold_traffic'){
    targets = db.prepare(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount <= 1`).all(1);

  }
    else if(campaignTargets==='warm_traffic'){
      targets = db.prepare(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount = 2`).all(1);

    }
      else if(campaignTargets==='hot_traffic') {
        targets = db.prepare(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount >= 3 AND totalOrderCount <5`).all(1);

      } 
      else if(campaignTargets==='loyal_traffic'){

        targets = db.prepare(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount >= 5`).all(1);

      }

      else  if(campaignTargets==='all'){
        targets = db.prepare(`SELECT email FROM customers WHERE subscribed = ?`).all(1);
      }
      else if(campaignTargets==='bh_customers'){
     
        targets = db.prepare(`SELECT email FROM customers WHERE subscribed = ?`).all(0);
      }
      else{
        targets = JSON.parse(campaignTargets);
      }


      if(targetCustomersWithoutCurrentCampaign) targets =  
      targets.filter(target=>{
        const currTargetCamp = db.prepare(`SELECT currentCampaign FROM customers WHERE email = ?`).get(target.email);

        return !currTargetCamp || (JSON.parse(currTargetCamp.currentCampaign).finishedDate && Date.now() - JSON.parse(currTargetCamp.currentCampaign).finishedDate > 5 * 24 * 60 * 60 * 1000)


      })

      return targets;
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
    console.log('date is', date)
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1; // Note: Months are zero-indexed in JavaScript
    const dayOfWeek = date.getDay();

    return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
}



 module.exports = emailSendJob;