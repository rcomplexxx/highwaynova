const next = require('next');
const express = require('express');
const createSqliteTables = require('./utils/createSqliteTables.js')
const dbCleaner = require('./utils/dbCleaner.jsx');
const sendEmailJob = require('./utils/sendEmailJob.jsx');
const betterSqlite3 = require ("better-sqlite3");




const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

function startEmailJobs(){

  try{
  const db = betterSqlite3(process.env.DB_PATH);

const campaigns= db.prepare(`SELECT * FROM email_campaigns`).all();




//Ako je campaign email counter manji od sequence.emails.length - 1, runovati tu kampanju
//I datum izracunati na osnovu sendingDate i time gapove, mislim da je vec uradjen algoritam za to na sendEmailJob


console.log('campaigns', campaigns);

campaigns.forEach(campaign=>{


 

  const campaignEmails = JSON.parse(db.prepare(`SELECT emails FROM email_sequences WHERE id = ?`).get(campaign.sequenceId)?.emails);



  const currentEmailIndex = campaign.emailSentCounter;



  if(currentEmailIndex < campaignEmails.length ){



    
    let sendTimeGap = parseInt(campaignEmails[currentEmailIndex]?.sendTimeGap);
      if(!sendTimeGap || isNaN(sendTimeGap)) sendTimeGap = 0;

    let dateCalculated = campaign.sendingDateInUnix;
    campaignEmails.forEach((emailPointer, index) =>{
    
      if(index!==0 && index < currentEmailIndex+1)
      dateCalculated = dateCalculated + parseInt(emailPointer.sendTimeGap);
   

    })

    console.log('date now', new Date(Date.now()), 'calculated date', new Date(dateCalculated))

    let   finalSendingDate=(Date.now() - dateCalculated >  0)?
    Date.now()+60000: dateCalculated+sendTimeGap;




      // const altSendDate= new Date(new Date().getTime() + 1000 * 60 * 30).getTime();
      console.log('My send time is', sendTimeGap, new Date(finalSendingDate));


      
      sendEmailJob(finalSendingDate, campaign.id);
  }
})
  }
  catch(error){
    console.log('server start error', error);
  }

//mozda dodati i retry numbers i pokusati da posaljem mejl kroz 30 min. Tipa 5 retryja
//kad radim retryje, svaki email pomeriti za 30 min.
}


//PUT ADDITIONAL CODE HERE. IMPORTANT!

console.log('Additional code.');



app.prepare().then(() => {


  createSqliteTables();


  dbCleaner();
  //Here start email crons
  startEmailJobs();
  

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT} - env ${process.env.NODE_ENV}`);
  });
});