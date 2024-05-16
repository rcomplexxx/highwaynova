const cron = require('node-cron');
const betterSqlite3 = require('better-sqlite3');
const nodemailer = require("nodemailer");
const deleteSubbedBhSubs = require('./deleteSubbedBhSubs');





 async function emailSendJob( dateInUnix, campaignId) {


//

   



  


const date =formatDateToCron(new Date(dateInUnix));
console.log('setting email cron scheduler', date)

cron.schedule(date, () => {
  console.log('Send email here');
  //da li poslati svim mejlovima ili samo nekim?

    //inicijalizuji kampanju, i email kampanje(sa svim atributima).
    //proveri da li kampanja poseduje taj mejl, ako ne, neka greska je u pitanju i return
    //posalji email
    //Updatovati u db tu kampanju, sa razlikom da je email verdnost sent=true;
        // Ako je to bio zadnji mejlo u kampanju, staviti da je kampanja completed(ubaciti completed vrednost i 
        // prilikom kreiranja tabele campaign)
    //Ako nije zadnji mejl, pozvati funkciju emailSendJob( dateInUnix, campaignId, emailId)(da, istu ovu f-ju)
    //sa vrednostima sledeceg emaila(email sendDate), iste ove campaign, i sledeceg emailId

    try{

        const db = betterSqlite3(process.env.DB_PATH);
    const campaign= db.prepare(`SELECT * FROM email_campaigns WHERE id = ?`, campaignId).get(campaignId);

    const currentEmailIndex = campaign.emailSentCounter

    let sequenceEmailPointers = db.prepare(`SELECT emails from email_sequences WHERE ID = ?`).get(campaign.sequenceId);
    console.log('sequenceEmailPOinters', sequenceEmailPointers)
    if(sequenceEmailPointers)sequenceEmailPointers= JSON.parse(sequenceEmailPointers.emails);
    console.log('sequenceEmailPOinters', sequenceEmailPointers)

    
    

    //Da li je vreme sad premasilo izkalkulisano vreme koje je dogovoreno za odredjeni procenat(1.1*)


    let sendTimeGap = parseInt(sequenceEmailPointers[currentEmailIndex+1]?.sendTimeGap);
      if(!sendTimeGap || isNaN(sendTimeGap)) sendTimeGap = 0;

    let dateCalculated = campaign.sendingDateInUnix;
    sequenceEmailPointers.forEach((emailPointer, index) =>{
    
      if(index!==0 && index < currentEmailIndex+1)
      dateCalculated = dateCalculated + parseInt(emailPointer.sendTimeGap);
   

    })



    let   finalSendingDate=(Date.now() - dateCalculated > 0)?
    Date.now()+sendTimeGap: dateCalculated+sendTimeGap;

 
console.log('times', sendTimeGap, dateCalculated, finalSendingDate)
console.log('CAMPAIGN ID!!!!!!!!!!!!!! IS', campaignId)
   
  


   
    

    //Naci ovde sequence, pa onda mailovefinalSendingDate
      

    

        const email = db.prepare(`SELECT * FROM emails WHERE id = ?`).get(sequenceEmailPointers[currentEmailIndex].id);


        




    
        if(currentEmailIndex < sequenceEmailPointers.length)
            {
              console.log(`SCHEDULING NEXT EMAIL!!!!!!!!`, new Date(finalSendingDate) , new Date())

                emailSendJob( finalSendingDate, campaignId)
            }




        db.prepare(`UPDATE email_campaigns SET emailSentCounter = ? WHERE id = ?`).run(
          campaign.emailSentCounter + 1,
            campaign.id,
          );


          //Za sad gadjam sve subscribere.
          const potentialTargets = db.prepare(`SELECT * FROM subscribers`).all()?.map(target=>{return target.email});
         
         
         
         
         
         
         
          let targets;

          const campaignTargets= campaign.targetSubscribers;

          console.log('campaigntargets', campaignTargets, 'potential targets', potentialTargets)

          if(campaignTargets=='all'){
            targets= potentialTargets;
          }
          else if(campaignTargets=='cold_traffic'){
            targets= potentialTargets;
          }
            else if(campaignTargets=='warm_traffic'){
              targets= potentialTargets;
            }
              else if(campaignTargets=='hot_traffic') {
                targets= potentialTargets;
              } 
              else if(campaignTargets=='bh_subscribers'){
                deleteSubbedBhSubs();
              targets = db.prepare(`SELECT * FROM subscribersbh`).all()?.map(target=>{return target.email});
              }
              else{

                 targets= potentialTargets.filter(potentialTarget=>{
                  try{
                  return JSON.parse(campaignTargets).findIndex(target=>{
                     return potentialTarget==campaignTargets
                })==-1
              }
              catch{return false;}
              })


              }
         
         
         
         
         
         
         
         
         
         
          db.close();

            console.log('targets!!!!!!', targets)



          

            try {

          




              

              const transporter = nodemailer.createTransport({
                service: "hotmail",
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASSWORD,
                },
              });
    
              transporter.sendMail({
                //   from: 'orderconfirmed@selling-game-items-next.com',
                from: process.env.EMAIL_USER,
                to: targets,
                subject: email.title,
                html: email.text,
              });
            } catch (error) {
              console.error("Email not sent.", error);
            }

          

        console.log('here should be sent email with index', sequenceEmailPointers[currentEmailIndex])

        //Here email
    }
    catch(error){
        console.log('cron error', error)
    }
 
       





});


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