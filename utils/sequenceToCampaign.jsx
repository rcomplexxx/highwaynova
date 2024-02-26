const cron = require('node-cron');
const betterSqlite3 = require('better-sqlite3');






 function emailSendJob( sequenceId, dates, targetEmail) {


   




    try{

        const db = betterSqlite3(process.env.DB_PATH);
    const sequence= db.prepare(`SELECT * FROM emailCampaigns WHERE id = ?`, sequenceId).get(sequenceId);
  

      const sequenceEmails=JSON.parse(sequence.emails);
      if(sequenceEmails.length!=dates.length)return;
      console.log('campaignEmails', sequenceEmails);
        const campaignEmails= sequenceEmails.forEach((sequenceEmail, index)=>{
            return {id:sequenceEmail.id, sendDate:dates[index], sent:false}
        })

        const campaign = {...sequence, emails: JSON.stringify(campaignEmails), campaignType:'campaign'}

           
            //start cron

            const result =db.prepare(`INSERT INTO emailCampaigns (title, emails, campaignType, targetEmail) VALUES (?, ?, ?, ?)`).run(
                campaign.title,
                campaign.emails,
                campaign.campaignType,
                targetEmail?targetEmail:'all'
              );
      
              const campaignId = result.lastInsertRowid;
       


            db.close();

            emailSendJob(campaignEmails[0].sendDate, campaignId,campaignEmails[0].id )
        
    }
    catch(error){
        console.log('cron error', error)
    }
 
       


  console.log('Initialize new job scheduler if condition is met by calling emailSendJob again, and it is not'
  ,'considered a recursion as the task ends once the cron is set');
  //doSomethingWithEmail(email); Allowed because cron captures the variables used inside of it






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